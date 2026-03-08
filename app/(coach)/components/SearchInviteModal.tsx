import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    Share,
    Animated,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { CoachTheme } from '@/constants/theme';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import { getToken } from '@/utils/auth';

interface SearchResult {
    id: number;
    fullName: string;
    email: string;
    role: string;
}

interface SearchInviteModalProps {
    visible: boolean;
    targetRole: 'Athlete' | 'Competitor';
    onClose: () => void;
    onAdded: () => void; // Takıma ekleme sonrası listeyi yenile
}

export default function SearchInviteModal({ visible, targetRole, onClose, onAdded }: SearchInviteModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const [addingId, setAddingId] = useState<number | null>(null);

    // Davet kodu state
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [generatingCode, setGeneratingCode] = useState(false);
    const [copied, setCopied] = useState(false);

    // Debounce timer
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
            // Modal kapanınca state'leri sıfırla
            setQuery('');
            setResults([]);
            setSearched(false);
            setInviteCode(null);
            setCopied(false);
        }
    }, [visible]);

    const searchUsers = useCallback(async (text: string) => {
        if (text.length < 2) {
            setResults([]);
            setSearched(false);
            return;
        }

        setSearching(true);
        setSearched(true);
        try {
            const token = await getToken();
            const response = await fetch(API_ENDPOINTS.TEAM.SEARCH_USER(text), {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            }
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setSearching(false);
        }
    }, []);

    const handleQueryChange = (text: string) => {
        setQuery(text);
        setInviteCode(null);
        setCopied(false);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchUsers(text), 400);
    };

    const handleAddUser = async (userId: number) => {
        setAddingId(userId);
        try {
            const token = await getToken();
            const response = await fetch(API_ENDPOINTS.TEAM.ADD_BY_ID, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                // Kullanıcıyı listeden kaldır
                setResults(prev => prev.filter(r => r.id !== userId));
                onAdded();
                Alert.alert('Başarılı', 'Sporcu takımınıza eklendi!');
            } else {
                const errText = await response.text();
                Alert.alert('Hata', errText || 'Eklerken bir hata oluştu.');
            }
        } catch (err) {
            Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
        } finally {
            setAddingId(null);
        }
    };

    const handleGenerateCode = async () => {
        setGeneratingCode(true);
        try {
            const token = await getToken();
            const roleInt = targetRole === 'Athlete' ? 2 : 3;
            const response = await fetch(API_ENDPOINTS.TEAM.GENERATE_INVITE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: query.includes('@') ? query : null,
                    targetRole: roleInt,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setInviteCode(data.code);
                onAdded(); // Davet listesini yenilemek için tetikle
            } else {
                Alert.alert('Hata', 'Davet kodu oluşturulamadı.');
            }
        } catch (err) {
            Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
        } finally {
            setGeneratingCode(false);
        }
    };

    const handleCopyCode = async () => {
        if (!inviteCode) return;
        await Clipboard.setStringAsync(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareCode = async () => {
        if (!inviteCode) return;
        try {
            await Share.share({
                message: `ARCTeam'e katılmak için bu davet kodunu kullan: ${inviteCode}\n\nUygulamayı indirip kayıt olurken bu kodu gir.`,
            });
        } catch (err) {
            console.error('Share error:', err);
        }
    };

    const roleLabel = targetRole === 'Athlete' ? 'Sporcu' : 'Yarışmacı';
    const roleColor = targetRole === 'Athlete' ? CoachTheme.badgeAthlete : CoachTheme.badgeCompetitor;

    const renderSearchResult = ({ item }: { item: SearchResult }) => (
        <View style={styles.resultItem}>
            <View style={styles.resultAvatar}>
                <Text style={styles.resultAvatarText}>
                    {item.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                </Text>
            </View>
            <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{item.fullName}</Text>
                <Text style={styles.resultEmail}>{item.email}</Text>
            </View>
            <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: roleColor }]}
                onPress={() => handleAddUser(item.id)}
                disabled={addingId === item.id}
                activeOpacity={0.7}
            >
                {addingId === item.id ? (
                    <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    <>
                        <Ionicons name="person-add" size={14} color="#FFF" />
                        <Text style={styles.addBtnText}>Ekle</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <Animated.View style={[styles.modal, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>{roleLabel} Ekle / Davet Et</Text>
                            <Text style={styles.headerSubtitle}>
                                İsim veya e-posta ile arayın
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                            <Ionicons name="close" size={22} color={CoachTheme.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={18} color={CoachTheme.textMuted} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="İsim veya e-posta ara..."
                            placeholderTextColor={CoachTheme.textMuted}
                            value={query}
                            onChangeText={handleQueryChange}
                            autoCapitalize="none"
                            autoFocus
                        />
                        {query.length > 0 && (
                            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); setInviteCode(null); }}>
                                <Ionicons name="close-circle" size={18} color={CoachTheme.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {searching ? (
                            <View style={styles.centerContent}>
                                <ActivityIndicator size="large" color={roleColor} />
                                <Text style={styles.loadingText}>Aranıyor...</Text>
                            </View>
                        ) : results.length > 0 ? (
                            <FlatList
                                data={results}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderSearchResult}
                                contentContainerStyle={styles.resultsList}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : searched && !inviteCode ? (
                            // Kullanıcı bulunamadı
                            <View style={styles.centerContent}>
                                <View style={styles.emptyIcon}>
                                    <Ionicons name="person-outline" size={40} color={CoachTheme.textMuted} />
                                </View>
                                <Text style={styles.emptyTitle}>Kullanıcı Bulunamadı</Text>
                                <Text style={styles.emptySubtitle}>
                                    Davet kodu oluşturup gönderebilirsiniz
                                </Text>
                                <TouchableOpacity
                                    style={[styles.generateBtn, { backgroundColor: roleColor }]}
                                    onPress={handleGenerateCode}
                                    disabled={generatingCode}
                                    activeOpacity={0.7}
                                >
                                    {generatingCode ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="key-outline" size={18} color="#FFF" />
                                            <Text style={styles.generateBtnText}>Davet Kodu Oluştur</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ) : inviteCode ? (
                            // Davet kodu göster
                            <View style={styles.centerContent}>
                                <View style={styles.codeIcon}>
                                    <Ionicons name="checkmark-circle" size={48} color={CoachTheme.success} />
                                </View>
                                <Text style={styles.codeLabel}>Davet Kodu</Text>
                                <View style={styles.codeBox}>
                                    <Text style={styles.codeText}>{inviteCode}</Text>
                                </View>
                                <Text style={styles.codeHint}>
                                    Bu kodu sporcunuza gönderin. Kayıt olurken kullanabilir.
                                </Text>

                                <View style={styles.codeActions}>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, copied && styles.actionBtnCopied]}
                                        onPress={handleCopyCode}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={copied ? 'checkmark' : 'copy-outline'}
                                            size={18}
                                            color={copied ? CoachTheme.success : CoachTheme.text}
                                        />
                                        <Text style={[styles.actionBtnText, copied && { color: CoachTheme.success }]}>
                                            {copied ? 'Kopyalandı!' : 'Kopyala'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.shareBtn]}
                                        onPress={handleShareCode}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="share-social-outline" size={18} color="#FFF" />
                                        <Text style={[styles.actionBtnText, { color: '#FFF' }]}>Paylaş</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            // Başlangıç durumu
                            <View style={styles.centerContent}>
                                <Ionicons name="search" size={48} color={CoachTheme.textMuted} />
                                <Text style={styles.emptySubtitle}>
                                    Aramaya başlamak için en az 2 karakter girin
                                </Text>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: CoachTheme.overlay,
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: CoachTheme.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        minHeight: '70%',
        borderTopWidth: 1,
        borderColor: CoachTheme.cardBorder,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    headerTitle: {
        color: CoachTheme.text,
        fontSize: 20,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        marginTop: 2,
    },
    closeBtn: {
        padding: 8,
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        marginHorizontal: 20,
        paddingHorizontal: 14,
        gap: 10,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        color: CoachTheme.text,
        fontSize: 14,
        paddingVertical: 12,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    loadingText: {
        color: CoachTheme.textSecondary,
        fontSize: 14,
    },
    resultsList: {
        paddingBottom: 20,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CoachTheme.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        padding: 14,
        marginBottom: 8,
        gap: 12,
    },
    resultAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: CoachTheme.accentDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultAvatarText: {
        color: CoachTheme.accent,
        fontSize: 16,
        fontWeight: '700',
    },
    resultInfo: {
        flex: 1,
    },
    resultName: {
        color: CoachTheme.text,
        fontSize: 15,
        fontWeight: '600',
    },
    resultEmail: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    addBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    emptyIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    emptyTitle: {
        color: CoachTheme.text,
        fontSize: 17,
        fontWeight: '700',
    },
    emptySubtitle: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 260,
    },
    generateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 8,
    },
    generateBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    codeIcon: {
        marginBottom: 4,
    },
    codeLabel: {
        color: CoachTheme.textSecondary,
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    codeBox: {
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 2,
        borderColor: CoachTheme.accent,
        borderRadius: 16,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderStyle: 'dashed',
    },
    codeText: {
        color: CoachTheme.accent,
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: 6,
    },
    codeHint: {
        color: CoachTheme.textSecondary,
        fontSize: 12,
        textAlign: 'center',
        maxWidth: 260,
        lineHeight: 18,
    },
    codeActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: CoachTheme.cardBg,
        borderWidth: 1,
        borderColor: CoachTheme.cardBorder,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionBtnCopied: {
        borderColor: CoachTheme.success,
        backgroundColor: 'rgba(0, 229, 160, 0.08)',
    },
    actionBtnText: {
        color: CoachTheme.text,
        fontSize: 14,
        fontWeight: '600',
    },
    shareBtn: {
        backgroundColor: CoachTheme.accent,
        borderColor: CoachTheme.accent,
    },
});

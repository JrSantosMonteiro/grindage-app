import { useState } from 'react';
import {
  Flame,
  BookOpen,
  CheckCircle2,
  Trophy,
  Volume2,
  VolumeX,
  Edit2,
  Check,
  Globe,
  Sparkles,
} from 'lucide-react';
import { AppLanguage, StudyLanguage, UserProfile, WordUserStatus } from '../../types';
import { getLevelData, StorageService } from '../../services/storage';
import { SUPPORTED_LANGUAGES, t } from '../../i18n/translations';

interface ProfilePageProps {
  profile: UserProfile;
  wordStatuses: Record<string, WordUserStatus>;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenStreakModal: () => void;
  onResetData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSwitchStudyLanguage?: (lang: StudyLanguage) => void;
  onSwitchAppLanguage?: (lang: AppLanguage) => void;
}

const AVATAR_OPTIONS = ['🦊', '🦉', '🦁', '🚀', '⚡', '🌟', '🎯', '🐼', '🧠', '🦄'];

export function ProfilePage({
  profile,
  wordStatuses,
  onUpdateProfile,
  onOpenStreakModal,
  onResetData,
  soundEnabled,
  onToggleSound,
  onSwitchStudyLanguage,
  onSwitchAppLanguage,
}: ProfilePageProps) {
  const currentStudy = profile.currentStudyLanguage || 'en';
  const currentApp = profile.appLanguage || 'pt';

  const statusesList = Object.values(wordStatuses);
  const wordsLearned = statusesList.filter(
    (s) => s.status === 'learning' || s.status === 'known' || s.status === 'mastered'
  ).length;
  const wordsMastered = statusesList.filter((s) => s.status === 'mastered').length;
  const levelData = getLevelData(wordsLearned);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // 7 day streak representation
  const today = new Date();
  const dayNamesPt = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesEs = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayNamesFr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const dayNames =
    currentApp === 'en'
      ? dayNamesEn
      : currentApp === 'es'
      ? dayNamesEs
      : currentApp === 'fr'
      ? dayNamesFr
      : dayNamesPt;

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 6;
    const isStudied = profile.studiedDates.includes(dateStr);
    return {
      dateStr,
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      isToday,
      isStudied,
    };
  });

  const handleSaveName = () => {
    if (nameInput.trim()) {
      const updated = { ...profile, name: nameInput.trim() };
      onUpdateProfile(updated);
      setIsEditingName(false);
    }
  };

  const handleSelectAvatar = (av: string) => {
    const updated = { ...profile, avatar: av };
    onUpdateProfile(updated);
    setShowAvatarPicker(false);
  };

  return (
    <div className="space-y-6 w-full pb-12" id="profile-view">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#ECEBF1] shadow-2xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with edit trigger */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-[28px] bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-5xl shadow-xl shadow-purple-200/50 border-4 border-white">
              {profile.avatar}
            </div>
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-2 -right-2 p-2 rounded-full bg-[#7C3AED] text-white shadow-md hover:bg-[#6D28D9] transition-colors cursor-pointer"
              title="Trocar avatar"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Profile Name & Level */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3.5 py-1.5 bg-[#F8F7FA] border border-[#7C3AED] rounded-xl text-lg font-bold font-display text-[#1F1F23] focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 bg-[#7C3AED] text-white rounded-xl hover:bg-[#6D28D9] cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F23] font-display">
                    {profile.name}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1.5 text-[#7E7C89] hover:text-[#7C3AED] rounded-lg hover:bg-[#F3F0FF] cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#F3F0FF] text-[#7C3AED] text-xs font-bold">
                {t('dash.level', currentApp)} {profile.level} • {profile.levelTitle}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100 text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current text-orange-500" />
                {profile.streakDays} {t('streak.daysStreak', currentApp)}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-100 text-xs font-bold flex items-center gap-1">
                <span>{SUPPORTED_LANGUAGES[currentStudy]?.flag}</span>
                <span>{SUPPORTED_LANGUAGES[currentStudy]?.nativeName}</span>
              </span>
            </div>

            {/* Level Vocabulary Progress Bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-xs font-bold text-[#7E7C89] mb-1.5">
                <span>{t('dash.levelProgress', currentApp)}</span>
                <span className="text-[#7C3AED] font-bold">
                  {wordsLearned} / {levelData.nextLevelWords} {t('dash.words', currentApp)}
                </span>
              </div>
              <div className="w-full h-2 bg-[#F3F0FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7C3AED] rounded-full"
                  style={{ width: `${levelData.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Picker Popup */}
        {showAvatarPicker && (
          <div className="mt-6 p-4.5 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF1]">
            <span className="text-xs font-bold text-[#1F1F23] block mb-2.5">
              Escolha seu novo avatar:
            </span>
            <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  onClick={() => handleSelectAvatar(av)}
                  className={`w-11 h-11 text-2xl rounded-2xl bg-white border-2 hover:scale-110 transition-all flex items-center justify-center cursor-pointer ${
                    profile.avatar === av ? 'border-[#7C3AED] shadow-xs' : 'border-[#ECEBF1]'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Language Progress Breakdown (4 Isolated Languages) */}
      <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#ECEBF1] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F3F0FF] text-[#7C3AED] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F1F23] font-display">
                {t('lang.studySelection', currentApp)}
              </h3>
              <p className="text-xs text-[#7E7C89]">
                Progresso individual separado por idioma
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {(Object.keys(SUPPORTED_LANGUAGES) as StudyLanguage[]).map((langKey) => {
            const lang = SUPPORTED_LANGUAGES[langKey];
            const isCurrent = currentStudy === langKey;
            const progress = profile.languagesProgress?.[langKey] || {
              level: 1,
              streakDays: 0,
              wordsLearned: 0,
              wordsMastered: 0,
              completedSessionsCount: 0,
            };

            return (
              <div
                key={langKey}
                onClick={() => onSwitchStudyLanguage && onSwitchStudyLanguage(langKey)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#FAF5FF] border-[#7C3AED] shadow-xs ring-2 ring-purple-500/15'
                    : 'bg-[#F8F7FA] border-[#ECEBF1] hover:border-purple-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div className="text-sm font-bold text-[#1F1F23]">{lang.nativeName}</div>
                      <div className="text-[11px] text-[#7E7C89]">{lang.name}</div>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold">
                      Ativo
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-[#7C3AED]">
                      Trocar
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#ECEBF1]/70 text-xs">
                  <div>
                    <span className="text-[#7E7C89] block text-[10px]">Nível</span>
                    <span className="font-bold text-[#1F1F23]">Lvl {progress.level}</span>
                  </div>
                  <div>
                    <span className="text-[#7E7C89] block text-[10px]">Palavras</span>
                    <span className="font-bold text-[#7C3AED]">{progress.wordsLearned}</span>
                  </div>
                  <div>
                    <span className="text-[#7E7C89] block text-[10px]">Sequência</span>
                    <span className="font-bold text-orange-600">{progress.streakDays} dias</span>
                  </div>
                  <div>
                    <span className="text-[#7E7C89] block text-[10px]">Sessões</span>
                    <span className="font-bold text-[#1F1F23]">{progress.completedSessionsCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Sequência Semanal (7 dias) */}
      <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#ECEBF1] shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-current text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F1F23] font-display">
                {t('streak.title', currentApp)} ({SUPPORTED_LANGUAGES[currentStudy]?.nativeName})
              </h3>
              <p className="text-xs text-[#7E7C89]">
                {t('streak.last7Days', currentApp)}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenStreakModal}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3.5 py-2 rounded-xl border border-orange-200 cursor-pointer"
          >
            {t('streak.modalBtn', currentApp)} 🔥
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2.5">
          {last7Days.map((item) => (
            <div
              key={item.dateStr}
              className={`flex flex-col items-center p-3.5 rounded-2xl border text-center transition-all ${
                item.isStudied
                  ? 'bg-gradient-to-b from-orange-500 to-amber-500 text-white border-orange-400 shadow-xs'
                  : item.isToday
                  ? 'bg-white text-[#7C3AED] border-dashed border-[#7C3AED]'
                  : 'bg-[#F8F7FA] text-[#7E7C89] border-[#ECEBF1]'
              }`}
            >
              <span className="text-[11px] font-medium opacity-90">{item.dayName}</span>
              <span className="text-base font-bold my-1">{item.dayNum}</span>
              <div>
                {item.isStudied ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span className="block w-2 h-2 rounded-full bg-[#ECEBF1]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Grid de Estatísticas Detalhadas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-[24px] bg-white border border-[#ECEBF1] shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#F3F0FF] text-[#7C3AED] flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#1F1F23] font-display">{wordsLearned}</div>
          <div className="text-xs font-medium text-[#7E7C89] mt-0.5">{t('dash.learnedWords', currentApp)}</div>
        </div>

        <div className="p-6 rounded-[24px] bg-white border border-[#ECEBF1] shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#1F1F23] font-display">{wordsMastered}</div>
          <div className="text-xs font-medium text-[#7E7C89] mt-0.5">{t('dash.masteredWords', currentApp)}</div>
        </div>

        <div className="p-6 rounded-[24px] bg-white border border-[#ECEBF1] shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center mb-3">
            <Flame className="w-4 h-4 fill-current text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-[#1F1F23] font-display">
            {profile.bestStreak} <span className="text-xs text-[#7E7C89]">{t('dash.days', currentApp)}</span>
          </div>
          <div className="text-xs font-medium text-[#7E7C89] mt-0.5">{t('dash.streakCard', currentApp)}</div>
        </div>

        <div className="p-6 rounded-[24px] bg-white border border-[#ECEBF1] shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#F3F0FF] text-[#7C3AED] flex items-center justify-center mb-3">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#1F1F23] font-display">
            {profile.completedSessionsCount}
          </div>
          <div className="text-xs font-medium text-[#7E7C89] mt-0.5">{t('dash.completedSessions', currentApp)}</div>
        </div>
      </div>

      {/* 5. Preferências & Configurações Locais */}
      <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#ECEBF1] shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-[#1F1F23] font-display">
          Preferências do Aplicativo
        </h3>

        {/* App Interface Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#ECEBF1] gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F3F0FF] text-[#7C3AED]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#1F1F23]">
                {t('lang.appLanguage', currentApp)}
              </div>
              <div className="text-xs text-[#7E7C89]">
                Idioma dos textos, botões e menus da interface
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {(['pt', 'en', 'es', 'fr'] as AppLanguage[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onSwitchAppLanguage && onSwitchAppLanguage(code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentApp === code
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-[#F8F7FA] text-[#7E7C89] hover:bg-[#F3F0FF] hover:text-[#7C3AED]'
                }`}
              >
                {SUPPORTED_LANGUAGES[code].flag} {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-[#ECEBF1]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F3F0FF] text-[#7C3AED]">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#1F1F23]">Efeitos Sonoros</div>
              <div className="text-xs text-[#7E7C89]">Tocar sons de acerto, erro e fanfarras</div>
            </div>
          </div>
          <button
            onClick={onToggleSound}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'bg-[#F8F7FA] text-[#7E7C89] border border-[#ECEBF1]'
            }`}
          >
            {soundEnabled ? 'Ativado' : 'Desativado'}
          </button>
        </div>

        {/* Reset progress */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-xs sm:text-sm font-bold text-rose-700">Redefinir Dados</div>
            <div className="text-xs text-[#7E7C89]">Limpar o armazenamento local e recomeçar do zero</div>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja reiniciar todo o seu progresso no Grindage?')) {
                onResetData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
          >
            Resetar Progresso
          </button>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
	{ code: 'en', label: 'EN' },
	{ code: 'es', label: 'ES' },
	{ code: 'fr', label: 'FR' },
	{ code: 'de', label: 'DE' },
	{ code: 'zh', label: '中文' },
	{ code: 'ja', label: '日本語' },
	{ code: 'pt', label: 'PT' },
	{ code: 'pt-BR', label: 'PT-BR' },
	{ code: 'ru', label: 'RU' },
	{ code: 'it', label: 'IT' },
	{ code: 'ko', label: 'KO' },
	{ code: 'tr', label: 'TR' },
	{ code: 'vi', label: 'VI' },
	{ code: 'th', label: 'TH' },
	{ code: 'nl', label: 'NL' },
	{ code: 'pl', label: 'PL' },
	{ code: 'id', label: 'ID' },
	{ code: 'ar', label: 'AR' },
	{ code: 'hi', label: 'HI' },
	{ code: 'sv', label: 'SV' },
	{ code: 'uk', label: 'UK' },
	{ code: 'tl', label: 'TL' },
	{ code: 'ms', label: 'MS' },
];

const LanguageSwitcher: React.FC<{ variant?: string }> = ({ variant }) => {
	const { i18n } = useTranslation();
	const currentLang = i18n.language;

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const lang = e.target.value;
		i18n.changeLanguage(lang);
		// Google Translate integration
		const googleLangMap: Record<string, string> = {
			'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'zh': 'zh-CN', 'ja': 'ja', 'pt': 'pt', 'pt-BR': 'pt',
			'ru': 'ru', 'it': 'it', 'ko': 'ko', 'tr': 'tr', 'vi': 'vi', 'th': 'th', 'nl': 'nl', 'pl': 'pl', 'id': 'id',
			'ar': 'ar', 'hi': 'hi', 'sv': 'sv', 'uk': 'uk', 'tl': 'tl', 'ms': 'ms'
		};
		const googleLang = googleLangMap[lang] || lang;
		setTimeout(() => {
			const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
			if (select) {
				select.value = googleLang;
				select.dispatchEvent(new Event('change'));
			}
		}, 300);
	};

	return (
		<select
			className={`language-switcher${variant ? ` language-switcher--${variant}` : ''}`}
			value={currentLang}
			onChange={handleChange}
			aria-label="Select language"
		>
			{LANGUAGES.map((lang) => (
				<option key={lang.code} value={lang.code}>
					{lang.label}
				</option>
			))}
		</select>
	);
};

export default LanguageSwitcher;

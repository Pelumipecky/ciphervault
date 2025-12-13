
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
];

const LanguageSwitcher: React.FC<{ variant?: string }> = ({ variant }) => {
	const { i18n } = useTranslation();
	const currentLang = i18n.language;

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		i18n.changeLanguage(e.target.value);
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

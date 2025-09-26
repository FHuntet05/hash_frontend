// RUTA: frontend/src/components/team/SocialShare.jsx (DISEÑO LIMPIO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaXTwitter, FaFacebookF, FaLinkedinIn, FaWhatsapp, FaInstagram, FaTiktok, FaTelegram } from 'react-icons/fa6';
import { HiOutlineVideoCamera } from 'react-icons/hi2';

const SocialShare = ({ referralLink }) => {
  const { t } = useTranslation();
  const shareText = encodeURIComponent(t('socialShare.text', '¡Únete a mi equipo en EVERCHAIN BOT y empecemos a producir juntos! Mi enlace:'));

  const socialPlatforms = [
    { name: 'X', icon: FaXTwitter, url: `https://twitter.com/intent/tweet?url=${referralLink}&text=${shareText}`, color: 'hover:text-white hover:bg-[#000000]' },
    { name: 'Facebook', icon: FaFacebookF, url: `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`, color: 'hover:text-white hover:bg-[#1877F2]' },
    { name: 'Telegram', icon: FaTelegram, url: `https://t.me/share/url?url=${referralLink}&text=${shareText}`, color: 'hover:text-white hover:bg-[#26A5E4]' },
    { name: 'WhatsApp', icon: FaWhatsapp, url: `https://api.whatsapp.com/send?text=${shareText} ${referralLink}`, color: 'hover:text-white hover:bg-[#25D366]' },
    { name: 'LinkedIn', icon: FaLinkedinIn, url: `https://www.linkedin.com/shareArticle?mini=true&url=${referralLink}&title=${t('socialShare.title', 'Únete a Mega Fábrica')}`, color: 'hover:text-white hover:bg-[#0A66C2]' },
  ];

  return (
    <div className="w-full mt-4">
      <h3 className="text-sm font-semibold text-text-secondary mb-3">{t('socialShare.shareOn', 'Compartir en')}</h3>
      <div className="grid grid-cols-5 gap-4">
        {socialPlatforms.map(({ name, icon: Icon, url, color }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            // Estilo adaptado al tema claro
            className={`flex items-center justify-center aspect-square rounded-full bg-card/70 border border-border text-text-secondary transition-all duration-300 ${color}`}
          >
            <Icon size={20} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialShare;
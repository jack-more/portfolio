'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

function FloatingProfile() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.div
      className="floating-profile"
      style={{ y, opacity }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <video
        className="profile-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/sitevideo.mp4" type="video/mp4" />
      </video>
    </motion.div>
  );
}

export default FloatingProfile;

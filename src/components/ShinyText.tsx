import { motion } from 'framer-motion';

interface ShinyTextProps {
  text: string;
  className?: string;
}

export const ShinyText = ({ text, className = '' }: ShinyTextProps) => {
  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{
        backgroundImage: 'linear-gradient(100deg, #64CEFB 25%, #ffffff 50%, #64CEFB 75%)',
        backgroundSize: '200% auto',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
      }}
      animate={{
        backgroundPositionX: ['100%', '-100%'],
      }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: 'linear',
      }}
    >
      {text}
    </motion.span>
  );
};
export default ShinyText;

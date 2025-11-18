import React from 'react';
import { motion } from 'framer-motion';
type MotionDivProps = React.ComponentPropsWithoutRef<typeof motion.div>;
interface CardProps extends MotionDivProps {
    glass?: boolean;
    hover?: boolean;
}
export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=Card.d.ts.map
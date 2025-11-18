import React from 'react';
import { motion } from 'framer-motion';
type MotionButtonProps = React.ComponentPropsWithoutRef<typeof motion.button>;
interface ButtonProps extends MotionButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    magnetic?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=Button.d.ts.map
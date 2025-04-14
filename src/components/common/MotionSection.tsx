import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import React, { forwardRef } from 'react';

const defaultAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

type Ref = HTMLDivElement;
type MotionSectionProps = HTMLMotionProps<'div'>;

const MotionSection = forwardRef<Ref, MotionSectionProps>((props, ref) => (
  <motion.div
    ref={ref}
    {...defaultAnimation}
    {...props}
  />
));

MotionSection.displayName = 'MotionSection';

export default MotionSection;

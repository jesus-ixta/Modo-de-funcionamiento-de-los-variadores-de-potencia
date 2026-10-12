import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      // Clean string from enclosing $ or $$ if provided
      let cleanMath = math.trim();
      if (cleanMath.startsWith('$$') && cleanMath.endsWith('$$')) {
        cleanMath = cleanMath.slice(2, -2).trim();
      } else if (cleanMath.startsWith('$') && cleanMath.endsWith('$')) {
        cleanMath = cleanMath.slice(1, -1).trim();
      }
      return katex.renderToString(cleanMath, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch (e) {
      console.warn('KaTeX render error:', e);
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-block math-rendered ${block ? 'block text-center my-2' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface RenderRichTextWithMathProps {
  text: string;
  className?: string;
}

export const RenderRichTextWithMath: React.FC<RenderRichTextWithMathProps> = ({ text, className = '' }) => {
  // Parses text with $...$ for inline math or $$...$$ for display math
  const parts = useMemo(() => {
    if (!text) return [];
    // Split on $$...$$ or $...$
    const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
    const splitArr = text.split(regex);

    return splitArr.map((part, idx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const mathContent = part.slice(2, -2).trim();
        return <MathView key={idx} math={mathContent} block={true} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const mathContent = part.slice(1, -1).trim();
        return <MathView key={idx} math={mathContent} block={false} />;
      }
      return <span key={idx}>{part}</span>;
    });
  }, [text]);

  return <span className={className}>{parts}</span>;
};

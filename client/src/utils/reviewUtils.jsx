import React from 'react';

export const proKeywords = ['good', 'great', 'excellent', 'amazing', 'best', 'quality', 'value', 'pros', 'positive', 'love', 'like', 'fast', 'durable', 'reliable', 'perfect'];
export const conKeywords = ['bad', 'poor', 'worst', 'terrible', 'waste', 'expensive', 'cons', 'negative', 'hate', 'dislike', 'slow', 'flimsy', 'unreliable', 'broken', 'disappointed'];

export const getConfidenceScore = (comment, rating) => {
    if (!comment) return 1;
    let score = 1;
    if (comment.length > 50) score += 1;
    if (comment.length > 200) score += 2;

    const lowerComment = comment.toLowerCase();
    const hasPro = proKeywords.some(word => lowerComment.includes(word));
    const hasCon = conKeywords.some(word => lowerComment.includes(word));

    if (hasPro && hasCon) score += 1;
    else if (hasPro || hasCon) score += 0.5;

    if (rating > 0) score += 0.5;

    return Math.min(Math.round(score), 5);
};

export const highlightText = (text, styles) => {
    if (!text) return text;
    const allKeywords = [...proKeywords, ...conKeywords];

    // Use a regex to split by keywords while keeping them
    const parts = text.split(new RegExp(`\\b(${allKeywords.join('|')})\\b`, 'gi'));

    return parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        if (proKeywords.includes(lowerPart)) {
            return <span key={index} className={styles.proHighlight}>{part}</span>;
        } else if (conKeywords.includes(lowerPart)) {
            return <span key={index} className={styles.conHighlight}>{part}</span>;
        }
        return part;
    });
};

export const confidenceLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

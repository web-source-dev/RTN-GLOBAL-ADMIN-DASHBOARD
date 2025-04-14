/**
 * SEO Validator Utility
 * Analyzes blog content and provides SEO scores and recommendations
 */

// Minimum ideal lengths for SEO fields
const MIN_LENGTHS = {
  title: 30, // Min 30 chars for title
  description: 120, // Min 120 chars for description
  content: 1000, // Min 300 chars for content
  paragraphs: 40, // Min 40 chars per paragraph
  maxParagraph: 1000, // Max length recommendation
};

// Maximum ideal lengths for SEO fields
const MAX_LENGTHS = {
  title: 60, // Max 60 chars for title (Google typically displays 50-60)
  description: 160, // Max 160 chars for meta description
};

// Score weights for different factors
const WEIGHTS = {
  title: 15,
  description: 10,
  keywords: 15,
  content: 20,
  headings: 10,
  images: 10,
  links: 10,
  readability: 10,
  urlSlug: 5,
  metaData: 5,
  social: 10, // Added weight for social media to the overall score
};

// Helper function to safely check for word boundaries with keywords
const containsKeyword = (text, keyword) => {
  if (!text || !keyword) return false;
  // Escape special regex characters in the keyword
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Create regex with word boundaries
  const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
  return regex.test(text);
};

/**
 * Helper function to check if a value is present/valid
 * Correctly handles different types of values (strings, objects, files, etc.)
 */
const isValuePresent = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'object') {
    // For File objects or other objects that have a name property (like input type=file)
    if (value.name) return true;
    // For objects like blobs or those with URLs
    if (value.url || value.src || value.preview) return true;
    // For objects with size (like File objects)
    if (value.size && value.size > 0) return true;
  }
  return true;
};

/**
 * Analyzes the title for SEO
 * @param {string} title - The blog post title
 * @param {Array} keywords - Array of target keywords
 * @returns {Object} Score and feedback
 */
export const analyzeTitle = (title, keywords = []) => {
  if (!title) {
    return { score: 0, feedback: ['Title is missing'] };
  }

  let score = 0;
  const feedback = [];
  const length = title.length;

  // Check length
  if (length < MIN_LENGTHS.title) {
    feedback.push(`Title is too short (${length} chars). Aim for at least ${MIN_LENGTHS.title} characters.`);
  } else if (length > MAX_LENGTHS.title) {
    feedback.push(`Title is too long (${length} chars). Keep it under ${MAX_LENGTHS.title} characters.`);
    score += (WEIGHTS.title / 2);
  } else {
    feedback.push(`Title length is good (${length} chars).`);
    score += WEIGHTS.title * 0.7;
  }

  // Check for keywords in title
  if (keywords && keywords.length > 0) {
    const lowerTitle = title.toLowerCase();
    // Count keywords found in title using proper word boundary check
    const keywordsFound = keywords.filter(kw => 
      kw && containsKeyword(lowerTitle, kw.toLowerCase())
    );
    
    if (keywordsFound.length > 0) {
      feedback.push(`Title contains ${keywordsFound.length} of your keywords.`);
      score += (keywordsFound.length / keywords.length) * (WEIGHTS.title * 0.3);
    } else {
      feedback.push('Title doesn\'t contain any of your target keywords.');
    }
  }

  return { score, feedback };
};

/**
 * Analyzes the description for SEO
 * @param {string} description - The blog post description
 * @param {Array} keywords - Array of target keywords
 * @returns {Object} Score and feedback
 */
export const analyzeDescription = (description, keywords = []) => {
  if (!description) {
    return { score: 0, feedback: ['Description is missing'] };
  }

  let score = 0;
  const feedback = [];
  const length = description.length;

  // Check length
  if (length < MIN_LENGTHS.description) {
    feedback.push(`Description is too short (${length} chars). Aim for at least ${MIN_LENGTHS.description} characters.`);
  } else if (length > MAX_LENGTHS.description) {
    feedback.push(`Description is too long (${length} chars). Keep it under ${MAX_LENGTHS.description} characters for optimal display in search results.`);
    score += (WEIGHTS.description / 2);
  } else {
    feedback.push(`Description length is good (${length} chars).`);
    score += WEIGHTS.description * 0.7;
  }

  // Check for keywords in description
  if (keywords && keywords.length > 0) {
    const lowerDesc = description.toLowerCase();
    // Count keywords found in description using proper word boundary check
    const keywordsFound = keywords.filter(kw => 
      kw && containsKeyword(lowerDesc, kw.toLowerCase())
    );
    
    if (keywordsFound.length > 0) {
      feedback.push(`Description contains ${keywordsFound.length} of your keywords.`);
      score += (keywordsFound.length / keywords.length) * (WEIGHTS.description * 0.3);
    } else {
      feedback.push('Description doesn\'t contain any of your target keywords.');
    }
  }

  return { score, feedback };
};

/**
 * Analyzes the content for SEO
 * @param {string} content - The blog post content (HTML)
 * @param {Array} keywords - Array of target keywords
 * @returns {Object} Score and feedback
 */
export const analyzeContent = (content, keywords = []) => {
  if (!content) {
    return { score: 0, feedback: ['Content is missing'] };
  }

  let score = 0;
  const feedback = [];
  
  // Strip HTML tags for text analysis
  const strippedContent = content.replace(/<[^>]*>/g, ' ');
  const length = strippedContent.length;

  // Check content length
  if (length < MIN_LENGTHS.content) {
    feedback.push(`Content is too short (${length} chars). Search engines prefer longer, substantive content.`);
  } else if (length > 1000 && length < 3000) {
    feedback.push(`Content length is acceptable (${length} chars), but aim for 3000+ for better SEO.`);
    score += WEIGHTS.content * 0.5;
  } else if (length >= 3000) {
    feedback.push(`Content length is good (${length} chars).`);
    score += WEIGHTS.content * 0.7;
  }

  // Check for keywords in content
  if (keywords && keywords.length > 0) {
    const lowerContent = strippedContent.toLowerCase();
    const keywordCounts = {};
    let totalKeywords = 0;
    
    keywords.forEach(kw => {
      if (!kw) return;
      
      // Escape special regex characters in the keyword
      const escapedKeyword = kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Create regex with word boundaries
      const regex = new RegExp('\\b' + escapedKeyword + '\\b', 'g');
      const matches = lowerContent.match(regex) || [];
      keywordCounts[kw] = matches.length;
      totalKeywords += matches.length;
    });
    
    if (totalKeywords === 0) {
      feedback.push('Content doesn\'t contain any of your target keywords.');
    } else {
      const wordCount = strippedContent.split(/\s+/).filter(word => word.length > 0).length || 1; // Avoid division by zero
      const keywordDensity = (totalKeywords / wordCount) * 100;
      feedback.push(`Keyword density: ${keywordDensity.toFixed(2)}% (${totalKeywords} occurrences)`);
      
      if (keywordDensity > 5) {
        feedback.push('Keyword density is too high. This might appear as keyword stuffing.');
        score += WEIGHTS.keywords * 0.3;
      } else if (keywordDensity > 0.5 && keywordDensity <= 5) {
        feedback.push('Keyword density is good.');
        score += WEIGHTS.keywords * 0.9;
      } else {
        feedback.push('Keyword density is too low.');
        score += WEIGHTS.keywords * 0.3;
      }
    }
  }

  // Check for headings
  const headingMatches = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/g) || [];
  if (headingMatches.length === 0) {
    feedback.push('No headings found. Use H2-H6 tags to structure your content.');
  } else {
    feedback.push(`Content has ${headingMatches.length} heading(s).`);
    score += Math.min(headingMatches.length / 3, 1) * WEIGHTS.headings;
  }

  // Check for images
  const imageMatches = content.match(/<img[^>]*>/g) || [];
  if (imageMatches.length === 0) {
    feedback.push('No images found. Add images with alt text to improve engagement and SEO.');
  } else {
    const altTextMissing = imageMatches.filter(img => !img.includes('alt=') || img.includes('alt=""')).length;
    feedback.push(`Content has ${imageMatches.length} image(s)`);
    
    if (altTextMissing > 0) {
      feedback.push(`${altTextMissing} image(s) missing alt text.`);
      score += (imageMatches.length - altTextMissing) / imageMatches.length * WEIGHTS.images;
    } else {
      feedback.push('All images have alt text. Great!');
      score += WEIGHTS.images;
    }
  }

  // Check for links
  const linkMatches = content.match(/<a[^>]*href=["'][^"']*["'][^>]*>.*?<\/a>/g) || [];
  if (linkMatches.length === 0) {
    feedback.push('No links found. Add internal and external links to improve SEO.');
  } else {
    feedback.push(`Content has ${linkMatches.length} link(s).`);
    score += Math.min(linkMatches.length / 2, 1) * WEIGHTS.links;
  }

  // Analyze paragraph length for readability
  const paragraphs = content.split(/<p[^>]*>|<\/p>/).filter(p => 
    p.trim() !== '' && !p.match(/^<[^>]*>$/));
  
  if (paragraphs.length === 0) {
    feedback.push('No paragraphs found. Structure your content with <p> tags.');
  } else {
    const shortParagraphs = paragraphs.filter(p => p.length < MIN_LENGTHS.paragraphs).length;
    const longParagraphs = paragraphs.filter(p => p.length > MIN_LENGTHS.maxParagraph).length;
    
    if (shortParagraphs > 0) {
      feedback.push(`${shortParagraphs} paragraph(s) are too short (<${MIN_LENGTHS.paragraphs} chars).`);
    }
    
    if (longParagraphs > 0) {
      feedback.push(`${longParagraphs} paragraph(s) are too long (>${MIN_LENGTHS.maxParagraph} chars).`);
    }
    
    if (shortParagraphs === 0 && longParagraphs === 0) {
      feedback.push('Paragraph lengths are good for readability.');
      score += WEIGHTS.readability;
    } else {
      score += WEIGHTS.readability * (1 - ((shortParagraphs + longParagraphs) / paragraphs.length));
    }
  }

  return { score, feedback };
};

/**
 * Analyzes the slug for SEO
 * @param {string} slug - The URL slug
 * @returns {Object} Score and feedback
 */
export const analyzeSlug = (slug) => {
  if (!slug) {
    return { score: 0, feedback: ['URL slug is missing'] };
  }

  let score = 0;
  const feedback = [];

  // Check length
  if (slug.length < 3) {
    feedback.push('URL slug is too short.');
  } else if (slug.length > 75) {
    feedback.push('URL slug is too long. Consider making it more concise.');
    score += WEIGHTS.urlSlug * 0.3;
  } else {
    feedback.push('URL slug length is good.');
    score += WEIGHTS.urlSlug * 0.7;
  }

  // Check format
  if (slug.includes('--')) {
    feedback.push('URL slug contains consecutive hyphens.');
  } else if (slug.match(/^[a-z0-9-]+$/)) {
    feedback.push('URL slug format is good.');
    score += WEIGHTS.urlSlug * 0.3;
  } else {
    feedback.push('URL slug should only contain lowercase letters, numbers, and hyphens.');
  }

  return { score, feedback };
};

/**
 * Analyzes meta data for SEO
 * @param {Object} metaData - Object containing SEO metadata fields
 * @returns {Object} Score and feedback
 */
export const analyzeMetaData = (metaData) => {
  const { seoTitle, seoDescription, seoKeywords, canonicalUrl, noIndex } = metaData;
  
  let score = 0;
  const feedback = [];
  
  // Check if essential fields are filled
  if (isValuePresent(seoTitle)) {
    feedback.push('SEO title is set.');
    score += WEIGHTS.metaData * 0.3;
  } else {
    feedback.push('SEO title is missing.');
  }
  
  if (isValuePresent(seoDescription)) {
    feedback.push('SEO description is set.');
    score += WEIGHTS.metaData * 0.3;
  } else {
    feedback.push('SEO description is missing.');
  }
  
  if (seoKeywords && seoKeywords.length > 0) {
    feedback.push('SEO keywords are set.');
    score += WEIGHTS.metaData * 0.2;
  } else {
    feedback.push('SEO keywords are missing.');
  }
  
  if (isValuePresent(canonicalUrl)) {
    feedback.push('Canonical URL is set.');
    score += WEIGHTS.metaData * 0.2;
  } else {
    feedback.push('Consider setting a canonical URL to prevent duplicate content issues.');
  }
  
  if (noIndex === true) {
    feedback.push('WARNING: This post is set to noindex, which will prevent it from appearing in search results.');
  }
  
  return { score, feedback };
};

/**
 * Analyzes social media metadata for SEO
 * @param {Object} socialData - Object containing social media metadata
 * @returns {Object} Score and feedback
 */
export const analyzeSocialData = (socialData) => {
  const { ogTitle, ogDescription, ogImage, ogImagePreview, twitterTitle, twitterDescription, twitterImage, twitterImagePreview } = socialData;
  
  let score = 0;
  const feedback = [];
  const maxScore = 5; // Maximum score for social media data only
  
  // Check Open Graph data
  if (isValuePresent(ogTitle)) {
    feedback.push('Open Graph title is set.');
    score += 1;
  } else {
    feedback.push('Open Graph title is missing.');
  }
  
  if (isValuePresent(ogDescription)) {
    feedback.push('Open Graph description is set.');
    score += 1;
  } else {
    feedback.push('Open Graph description is missing.');
  }
  
  // Check for either ogImage or ogImagePreview
  if (isValuePresent(ogImage) || isValuePresent(ogImagePreview)) {
    feedback.push('Open Graph image is set.');
    score += 1;
  } else {
    feedback.push('Open Graph image is missing.');
  }
  
  // Check Twitter Card data
  if (isValuePresent(twitterTitle)) {
    feedback.push('Twitter Card title is set.');
    score += 0.5;
  } else {
    feedback.push('Twitter Card title is missing.');
  }
  
  if (isValuePresent(twitterDescription)) {
    feedback.push('Twitter Card description is set.');
    score += 0.5;
  } else {
    feedback.push('Twitter Card description is missing.');
  }
  
  // Check for either twitterImage or twitterImagePreview
  if (isValuePresent(twitterImage) || isValuePresent(twitterImagePreview)) {
    feedback.push('Twitter Card image is set.');
    score += 1;
  } else {
    feedback.push('Twitter Card image is missing.');
  }
  
  // Calculate the weighted score for overall SEO score
  const weightedScore = (score / maxScore) * WEIGHTS.social;
  
  return { score: weightedScore, rawScore: score, maxRawScore: maxScore, feedback };
};

/**
 * Calculates overall SEO score and provides feedback
 * @param {Object} blogData - The complete blog data
 * @returns {Object} Overall score and feedback
 */
export const calculateSeoScore = (blogData) => {
  const { 
    title, 
    description, 
    content, 
    slug, 
    tags, 
    seoTitle, 
    seoDescription, 
    seoKeywords, 
    canonicalUrl, 
    noIndex,
    ogTitle, 
    ogDescription, 
    ogImage,
    ogImagePreview,
    twitterTitle, 
    twitterDescription, 
    twitterImage,
    twitterImagePreview
  } = blogData;
          
  // Use tags as keywords if no SEO keywords are provided
  const keywords = (seoKeywords && seoKeywords.length > 0) ? seoKeywords : tags || [];
  
  // Analyze each component
  const titleAnalysis = analyzeTitle(title, keywords);
  const descriptionAnalysis = analyzeDescription(description, keywords);
  const contentAnalysis = analyzeContent(content, keywords);
  const slugAnalysis = analyzeSlug(slug);
  const metaDataAnalysis = analyzeMetaData({ seoTitle, seoDescription, seoKeywords, canonicalUrl, noIndex });
  const socialDataAnalysis = analyzeSocialData({ 
    ogTitle, 
    ogDescription, 
    ogImage,
    ogImagePreview,
    twitterTitle, 
    twitterDescription, 
    twitterImage,
    twitterImagePreview
  });
  
  // Calculate total score (now including social score)
  const totalScore = (
    titleAnalysis.score +
    descriptionAnalysis.score +
    contentAnalysis.score +
    slugAnalysis.score +
    metaDataAnalysis.score +
    socialDataAnalysis.score // Now included in the total score
  );
  
  // Calculate percentage (out of 100)
  const maxPossibleScore = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
  const scorePercentage = Math.min(Math.round((totalScore / maxPossibleScore) * 100), 100);
  
  // Determine rating
  let rating;
  if (scorePercentage >= 90) {
    rating = 'Excellent';
  } else if (scorePercentage >= 70) {
    rating = 'Good';
  } else if (scorePercentage >= 50) {
    rating = 'Average';
  } else if (scorePercentage >= 30) {
    rating = 'Poor';
  } else {
    rating = 'Very Poor';
  }
  
  // Combine all feedback
  const allFeedback = {
    title: titleAnalysis.feedback,
    description: descriptionAnalysis.feedback,
    content: contentAnalysis.feedback,
    slug: slugAnalysis.feedback,
    metaData: metaDataAnalysis.feedback,
    socialData: socialDataAnalysis.feedback
  };
  
  // Top 3 recommendations
  let recommendations = [];
  if (titleAnalysis.score < WEIGHTS.title * 0.7) {
    recommendations.push('Improve your title by including keywords and optimizing length.');
  }
  if (descriptionAnalysis.score < WEIGHTS.description * 0.7) {
    recommendations.push('Enhance your meta description to better attract clicks from search results.');
  }
  if (contentAnalysis.score < WEIGHTS.content * 0.7) {
    recommendations.push('Improve your content by adding more substance, headings, images, and links.');
  }
  if (metaDataAnalysis.score < WEIGHTS.metaData * 0.7) {
    recommendations.push('Fill in your SEO metadata for better search engine visibility.');
  }
  if (socialDataAnalysis.score < (WEIGHTS.social * 0.6)) {
    recommendations.push('Add social media metadata to improve sharing appearance.');
  }
  
  // Limit to top 3
  recommendations = recommendations.slice(0, 3);
  
  // Use a higher raw score for social to make it more prominent
  const socialScorePercentage = Math.round((socialDataAnalysis.rawScore / socialDataAnalysis.maxRawScore) * 100);
  
  return {
    score: scorePercentage,
    rating,
    feedback: allFeedback,
    recommendations,
    socialScore: socialScorePercentage
  };
};

export default {
  analyzeTitle,
  analyzeDescription,
  analyzeContent,
  analyzeSlug,
  analyzeMetaData,
  analyzeSocialData,
  calculateSeoScore
}; 
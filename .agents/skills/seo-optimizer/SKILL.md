---
name: seo-optimizer
description: A skill to analyze, audit, and automatically implement SEO (Search Engine Optimization) best practices in HTML documents and React applications, including Open Graph tags, canonical URLs, semantic hierarchy, and mobile viewport controls.
---

# Overview
This skill outlines the standard operating procedures and validation rules for optimizing React and HTML projects for Search Engine Optimization (SEO), ensuring high indexability, search visibility, social media preview compatibility, and semantic markup consistency.

# Optimization Rules and Standards

## 1. Document Level Configuration (`index.html`)
- **Language Attribute**: The `<html>` tag must have the correct language attribute (`lang="es"` for Spanish, `lang="en"` for English) matching the primary content.
- **Document Title**: Keep titles between 50-60 characters. Format must use "Sentence Case" or "Title Case" and include the brand name (e.g. `BrandName — Primary Keyword Phrase`).
- **Meta Description**: Keep descriptions between 150-160 characters, providing a clear, engaging call to action of what the platform resolves.
- **Robots Directives**: Ensure search engines are allowed to crawl using `<meta name="robots" content="index, follow" />`.
- **Canonical Links**: Set `<link rel="canonical" href="https://playalibre.org/" />` to prevent duplicate indexing.

## 2. Social Media Sharing Meta Tags (Open Graph and Twitter)
- **Open Graph (og:)**:
  - `og:type` must be `website`.
  - `og:title` matching the page title.
  - `og:description` matching or summarising the meta description.
  - `og:url` pointing to the canonical url.
  - `og:image` pointing to a high-resolution, static absolute path asset (e.g., logo or banner).
- **Twitter Cards**:
  - `twitter:card` set to `summary_large_image` for large visual cards.
  - `twitter:title` and `twitter:description`.
  - `twitter:image` pointing to the visual asset.

## 3. Semantic Hierarchy and Content Structuring
- **Single `<h1>`**: Ensure there is exactly one `<h1>` tag on the main rendered view. This tag should represent the primary focus of the page.
- **Heading Order**: Nested headings (`<h2>`, `<h3>`, `<h4>`) must follow a strict, non-skipped structural hierarchy.
- **Semantic Tags**: Use appropriate HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, etc.) instead of generic nested `<div>` blocks where appropriate.
- **Image Accessibility**: All structural images must have descriptive `alt` tags.

# Verification Steps
1. Run HTML validators.
2. Confirm there are no duplicate title or meta description tags.
3. Validate Open Graph tags format using standard mock lint checks.

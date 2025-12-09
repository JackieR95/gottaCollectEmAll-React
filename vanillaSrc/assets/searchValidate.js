
/*
Modified by: Jacqueline Rael
Date: 06/11/2025
Lab: Final Project - GottaCollectEmAll
*/

/**
 * Returns a RegExp object to match Pokemon names similar to the search term.
 * - Case insensitive
 * - Partial matches included
 * - Exact match prioritized
 *
 * @param {string} searchTerm - User input from search bar
 * @returns {RegExp} regex to use for matching names
 */
export function getNameMatchRegex(searchTerm) {
    if (!searchTerm) {
      // Match everything if empty search term
      return /.*/i;
    }

    // Escape special regex chars to prevent invalid regex errors
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // If exact match (whole word) exists, match only that, else partial
    // Here we create a regex that matches exact word OR contains the term anywhere
    // The exact match will be handled separately in logic, so here just return partial match regex:

    // Simple partial match regex:
    return new RegExp(escapedTerm, 'i');
  }
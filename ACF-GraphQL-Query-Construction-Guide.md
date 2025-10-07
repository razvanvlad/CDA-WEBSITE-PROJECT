# ACF GraphQL Query Construction Guide

This guide explains how to construct GraphQL queries for ACF field groups by analyzing the JSON export and understanding the WPGraphQL schema structure.

## Table of Contents
1. [Understanding ACF Field Group Structure](#understanding-acf-field-group-structure)
2. [Field Types and Query Patterns](#field-types-and-query-patterns)
3. [Constructing Queries from JSON Export](#constructing-queries-from-json-export)
4. [Debugging and Verification Steps](#debugging-and-verification-steps)
5. [Common Issues and Solutions](#common-issues-and-solutions)

## Understanding ACF Field Group Structure

When you create an ACF field group, it gets exposed to GraphQL through a specific naming convention:

### Field Group Configuration
```json
{
  "key": "group_homepage_content",
  "title": "Homepage Content",
  "show_in_graphql": 1,
  "graphql_field_name": "homepageContent"
}
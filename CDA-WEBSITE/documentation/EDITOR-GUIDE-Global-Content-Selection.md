# Editor Guide: Global Content Selection

## Overview
The Global Content Selection feature allows you to control which global content blocks appear on each page of the website. This gives you flexibility to customize each page's content without duplicating blocks.

## Where to Find It

### In WordPress Admin:
1. Navigate to **Pages** in the WordPress admin
2. Edit any page (except the About page, which has its own system)
3. Look for the **"Global Content Selection"** meta box on the right side of the editor
4. You'll see a list of toggles for various content blocks

## Available Global Content Blocks

### From Global Shared Content:
- **Why CDA** - Displays reasons why clients choose CDA
- **Our Approach** - Shows the CDA approach/process steps
- **Culture Gallery Slider** - Image gallery of company culture
- **Full Video** - Embedded video section
- **Join Our Team** - Call-to-action for recruitment
- **3 Columns with Icons** - Three-column feature boxes
- **Contact Form Left/Image Right** - Contact form with image

### From Global Content Blocks:
- **Services Accordion** - Expandable services list
- **Showreel** - Video/image showcase reel
- **Technologies Slider** - Technology partner logos

## How to Use

### To Enable a Block:
1. Edit the page where you want the block to appear
2. Find the Global Content Selection meta box
3. Check the box next to the block you want to enable
4. Update/Save the page
5. The block will now appear on that page (if it has content)

### To Disable a Block:
1. Edit the page
2. Uncheck the box next to the block you want to remove
3. Update/Save the page
4. The block will no longer appear on that page

## Important Notes

### Content Requirements:
- A block will only appear if:
  - The toggle is enabled on the page
  - The actual block has content in Global Options
- Empty blocks won't display even if toggled on

### Page Exceptions:
- **About Page**: Has its own internal toggle system (under About Us Content)
- **Homepage**: Uses a different system for global blocks
- All other pages use this Global Content Selection system

### Block Order:
- Blocks appear in a predefined order on the frontend
- You cannot rearrange the order through toggles
- Contact development team if order changes are needed

## Managing Global Block Content

The actual content for these blocks is managed separately:

1. Go to **ACF Options** → **Global Content** in the admin menu
2. Edit the content for each global block
3. Changes here affect all pages where that block is enabled

## Troubleshooting

### Block Not Appearing:
- Verify the toggle is enabled on the page
- Check that the global block has content in ACF Options
- Clear any caching plugins
- Try viewing in an incognito/private browser window

### Block Appearing on Wrong Page:
- Check the page's Global Content Selection toggles
- Ensure you saved the page after making changes
- Clear browser and server caches

### Can't Find Global Content Selection:
- Make sure you're not editing the About page
- Check that you have proper editor permissions
- Contact your administrator if the meta box is missing

## Best Practices

1. **Plan Your Layout**: Before enabling blocks, consider the overall page flow
2. **Test on Staging**: Always test toggle changes on staging before production
3. **Keep Content Updated**: Regularly review global blocks to ensure content is current
4. **Document Changes**: Note which blocks are enabled on which pages for team reference

## Need Help?

If you encounter issues or need assistance:
1. Check this documentation first
2. Clear all caches (browser, WordPress, CDN)
3. Contact the development team with:
   - The page you're editing
   - Which block you're trying to enable/disable
   - Any error messages you see

---

*Last Updated: Current Version*
*Feature Added: Global Content Selection for all pages (except About)*

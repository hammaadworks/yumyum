-- IMPORTANT: Replace the placeholder UUIDs below with actual user IDs from your auth.users table.
-- You can create users via the Supabase UI or API, then update these UUIDs.
-- Admin User ID: This user should have an 'admin' role in their user_metadata if you have RBAC.
-- Vendor User ID: This user will be associated with the sample vendor data.
DO $$
DECLARE
    admin_user_uuid UUID := '00000000-0000-0000-0000-000000000001'; -- REPLACE WITH ACTUAL ADMIN USER ID
    vendor_user_uuid UUID := '00000000-0000-0000-0000-000000000002'; -- REPLACE WITH ACTUAL VENDOR USER ID
BEGIN

-- Insert statements for public.vendor_mappings
INSERT INTO public.vendor_mappings (vendor_slug, email, backend_type, supabase_project_id, imagekit_account_id, membership_fee, membership_validity, is_member, user_id) VALUES
('admin-slug', 'admin@example.com', 'supabase', 'admin-project-id', 'admin-imagekit-id', 0.0, (now() + '365 days'::interval), true, admin_user_uuid),
('yumyum-foods', 'vendor@example.com', 'supabase', 'vendor-project-id', 'vendor-imagekit-id', 99.99, (now() + '30 days'::interval), true, vendor_user_uuid);

-- Insert statements for public.brand (associated with the vendor_user_uuid)
INSERT INTO public.brand (vendor_id, name, logo_url, cuisine, description, payment_link, whatsapp, contact, location_link, review_link, instagram, facebook, youtube, custom, full_menu_pic) VALUES
(vendor_user_uuid, 'YumYum Foods', 'https://example.com/yumyum-logo.png', 'Multi-cuisine', 'Delicious food for every craving!', 'https://pay.yumyum.com', '+1234567890', 'info@yumyum.com', 'https://maps.app.goo.gl/example', 'https://reviews.yumyum.com', 'https://instagram.com/yumyumfoods', 'https://facebook.com/yumyumfoods', 'https://youtube.com/yumyumfoods', '{"delivery_info": "Free delivery over $50"}', 'https://example.com/full-menu.png');

-- Insert statements for public.dishes (associated with the vendor_user_uuid)
INSERT INTO public.dishes (vendor_id, category, name, description, price, instock, veg, tag, image, reel) VALUES
(vendor_user_uuid, 'Appetizers', 'Spring Rolls', 'Crispy vegetable spring rolls with sweet chili sauce.', 8.50, 'yes', 'veg', 'popular', 'https://example.com/spring-rolls.jpg', NULL),
(vendor_user_uuid, 'Main Course', 'Chicken Biryani', 'Fragrant basmati rice cooked with tender chicken and aromatic spices.', 15.00, 'yes', 'non-veg', 'spicy', 'https://example.com/chicken-biryani.jpg', 'https://example.com/biryani-reel.mp4'),
(vendor_user_uuid, 'Main Course', 'Paneer Butter Masala', 'Creamy tomato-based curry with soft paneer cubes.', 14.00, 'yes', 'veg', 'chef-special', 'https://example.com/paneer-butter-masala.jpg', NULL),
(vendor_user_uuid, 'Desserts', 'Gulab Jamun', 'Deep-fried milk solids soaked in rose-flavored sugar syrup.', 6.00, 'no', 'veg', 'sweet', 'https://example.com/gulab-jamun.jpg', NULL),
(vendor_user_uuid, 'Beverages', 'Mango Lassi', 'Refreshing yogurt drink with fresh mango pulp.', 5.50, 'yes', 'veg', 'cold', 'https://example.com/mango-lassi.jpg', NULL);

-- Insert statements for public.status (associated with the vendor_user_uuid)
INSERT INTO public.status (vendor_id, content, type) VALUES
(vendor_user_uuid, 'New special: Weekend Brunch Menu available!', 'text'),
(vendor_user_uuid, 'https://example.com/new-dish-promo.jpg', 'image'),
(vendor_user_uuid, 'https://example.com/cooking-showcase.mp4', 'video');

END $$;
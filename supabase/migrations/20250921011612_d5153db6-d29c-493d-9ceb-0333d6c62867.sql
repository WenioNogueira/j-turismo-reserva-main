-- Create admin profile for current user and fix ambiguous query
-- Insert admin profile for the current authenticated user
INSERT INTO public.profiles (user_id, role) 
SELECT auth.uid(), 'admin'
WHERE auth.uid() IS NOT NULL 
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Fix the ambiguous routes relationship by adding proper foreign key constraints
-- Drop existing foreign key constraints if they exist
ALTER TABLE public.reservations DROP CONSTRAINT IF EXISTS reservations_route_id_fkey;
ALTER TABLE public.reservations DROP CONSTRAINT IF EXISTS reservations_return_route_id_fkey;

-- Re-add foreign key constraints with proper names for clarity
ALTER TABLE public.reservations 
ADD CONSTRAINT reservations_route_id_fkey 
FOREIGN KEY (route_id) REFERENCES public.routes(id);

ALTER TABLE public.reservations 
ADD CONSTRAINT reservations_return_route_id_fkey 
FOREIGN KEY (return_route_id) REFERENCES public.routes(id);
-- Fix security vulnerability: Restrict reservation access to admin users only
-- Remove the overly permissive policy that allows any authenticated user to view all reservations
DROP POLICY "Only authenticated users can view reservations" ON public.reservations;

-- Create a security definer function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create new policy: Only admin users can view reservations
CREATE POLICY "Only admin users can view reservations" 
ON public.reservations 
FOR SELECT 
USING (public.is_admin_user());

-- Create policy: Only admin users can update reservations
CREATE POLICY "Only admin users can update reservations" 
ON public.reservations 
FOR UPDATE 
USING (public.is_admin_user());

-- Create policy: Only admin users can delete reservations
CREATE POLICY "Only admin users can delete reservations" 
ON public.reservations 
FOR DELETE 
USING (public.is_admin_user());
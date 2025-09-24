-- Create routes table for managing transportation routes
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservations table for storing customer bookings
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for routes (public read access, admin write access)
CREATE POLICY "Anyone can view active routes" 
ON public.routes 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage routes" 
ON public.routes 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for reservations (public insert, admin view all)
CREATE POLICY "Anyone can create reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can view reservations" 
ON public.reservations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for profiles (users can manage their own profile)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on routes
CREATE TRIGGER update_routes_updated_at
BEFORE UPDATE ON public.routes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert predefined routes
INSERT INTO public.routes (origin, destination, departure_time, price) VALUES
-- Outbound routes
('Floresta', 'Mirandiba', '05:40', 30.00),
('Jaburu', 'Mirandiba', '06:00', 25.00),
('Carnaubeira', 'Mirandiba', '06:15', 20.00),
('Juazeiro Grande', 'Mirandiba', '06:30', 15.00),

-- Return routes
('Mirandiba', 'Floresta', '12:00', 30.00),
('Mirandiba', 'Juazeiro Grande', '12:15', 25.00),
('Mirandiba', 'Carnaubeira', '12:35', 20.00),
('Mirandiba', 'Jaburu', '13:00', 15.00),
('Mirandiba', 'Floresta', '13:20', 10.00);

-- Enable realtime for all tables
ALTER TABLE public.routes REPLICA IDENTITY FULL;
ALTER TABLE public.reservations REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.routes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
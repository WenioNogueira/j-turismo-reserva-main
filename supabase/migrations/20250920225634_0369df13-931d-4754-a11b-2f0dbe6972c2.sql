-- Add new fields to reservations table
ALTER TABLE public.reservations 
ADD COLUMN protocol text,
ADD COLUMN travel_date date NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN trip_type text NOT NULL DEFAULT 'Ida',
ADD COLUMN return_route_id uuid REFERENCES public.routes(id),
ADD COLUMN observations text;

-- Add capacity field to routes table
ALTER TABLE public.routes 
ADD COLUMN capacity integer NOT NULL DEFAULT 15;

-- Create function to generate unique protocol
CREATE OR REPLACE FUNCTION public.generate_reservation_protocol()
RETURNS text AS $$
DECLARE
    protocol_date text;
    counter int;
    new_protocol text;
BEGIN
    -- Get current date in YYYYMMDD format
    protocol_date := to_char(CURRENT_DATE, 'YYYYMMDD');
    
    -- Get the count of reservations for today and increment
    SELECT COUNT(*) + 1 INTO counter
    FROM public.reservations 
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Generate protocol in format JT-YYYYMMDD-XXXX
    new_protocol := 'JT-' || protocol_date || '-' || LPAD(counter::text, 4, '0');
    
    RETURN new_protocol;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-generate protocol on insert
CREATE OR REPLACE FUNCTION public.set_reservation_protocol()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.protocol IS NULL THEN
        NEW.protocol := public.generate_reservation_protocol();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
CREATE TRIGGER set_reservation_protocol_trigger
    BEFORE INSERT ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_reservation_protocol();

-- Add constraint for trip_type
ALTER TABLE public.reservations 
ADD CONSTRAINT check_trip_type 
CHECK (trip_type IN ('Ida', 'Volta', 'Ida e Volta'));
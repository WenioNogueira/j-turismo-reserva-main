-- Insert default routes based on the JSON specification
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
  ('Floresta', 'Mirandiba', '05:40', 30, 15, true),
  ('Jaburu', 'Mirandiba', '06:00', 25, 15, true),
  ('Carnaubeira', 'Mirandiba', '06:15', 20, 15, true),
  ('Juazeiro Grande', 'Mirandiba', '06:30', 15, 15, true),
  ('Mirandiba', 'Floresta', '12:00', 30, 15, true),
  ('Mirandiba', 'Juazeiro Grande', '12:15', 25, 15, true),
  ('Mirandiba', 'Carnaubeira', '12:35', 20, 15, true),
  ('Mirandiba', 'Jaburu', '13:00', 15, 15, true),
  ON CONFLICT DO NOTHING;
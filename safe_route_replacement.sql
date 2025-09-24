-- Script para substituir rotas de forma segura (sem quebrar reservas existentes)
-- Execute este script no Supabase SQL Editor

-- 1. Verificar reservas existentes
SELECT 
    'RESERVAS EXISTENTES' as status,
    COUNT(*) as total_reservas
FROM reservations;

-- 2. Verificar rotas atuais
SELECT 
    'ROTAS ATUAIS' as status,
    COUNT(*) as total_rotas
FROM routes 
WHERE is_active = true;

-- 3. Desativar rotas antigas (em vez de deletar)
UPDATE routes 
SET is_active = false 
WHERE is_active = true;

-- 4. Inserir novas rotas
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- ROTAS DE SAÍDA - Rotas principais para Mirandiba
('Floresta', 'Mirandiba', '05:30', 30.00, 15, true),
('Jaburu', 'Mirandiba', '06:00', 20.00, 15, true),
('Carnaubeira', 'Mirandiba', '06:15', 20.00, 15, true),
('Juazeiro Grande', 'Mirandiba', '06:40', 20.00, 15, true),

-- ROTAS DE RETORNO - Rotas principais de Mirandiba
('Mirandiba', 'Floresta', '12:00', 30.00, 15, true),
('Mirandiba', 'Jaburu', '12:00', 20.00, 15, true),
('Mirandiba', 'Carnaubeira', '12:00', 20.00, 15, true),
('Mirandiba', 'Juazeiro Grande', '12:00', 20.00, 15, true),

-- ROTAS INTERMEDIÁRIAS DE SAÍDA
('Floresta', 'Jaburu', '05:30', 10.00, 15, true),
('Floresta', 'Carnaubeira', '05:30', 15.00, 15, true),
('Floresta', 'Juazeiro Grande', '05:30', 20.00, 15, true),
('Jaburu', 'Carnaubeira', '06:00', 10.00, 15, true),
('Jaburu', 'Juazeiro Grande', '06:00', 15.00, 15, true),
('Carnaubeira', 'Juazeiro Grande', '06:15', 20.00, 15, true),

-- ROTAS INTERMEDIÁRIAS DE RETORNO
('Juazeiro Grande', 'Carnaubeira', '12:15', 20.00, 15, true),
('Juazeiro Grande', 'Jaburu', '12:15', 20.00, 15, true),
('Juazeiro Grande', 'Floresta', '12:15', 20.00, 15, true),
('Carnaubeira', 'Jaburu', '12:35', 20.00, 15, true),
('Carnaubeira', 'Floresta', '12:35', 20.00, 15, true),
('Jaburu', 'Floresta', '13:00', 20.00, 15, true);

-- 5. Verificar resultado
SELECT 
    'ROTAS APÓS INSERÇÃO' as status,
    COUNT(*) as total_rotas_ativas
FROM routes 
WHERE is_active = true;

-- 6. Mostrar todas as rotas ativas organizadas
SELECT 
    CASE 
        WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 'SAÍDA'
        ELSE 'RETORNO'
    END as tipo,
    origin,
    destination,
    departure_time,
    CONCAT('R$ ', price) as preco,
    capacity
FROM routes 
WHERE is_active = true
ORDER BY 
    CASE WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 1 ELSE 2 END,
    departure_time,
    origin,
    destination;

-- 7. Verificar se as reservas antigas ainda funcionam
SELECT 
    'RESERVAS APÓS MUDANÇA' as status,
    COUNT(*) as total_reservas,
    COUNT(CASE WHEN r.is_active = true THEN 1 END) as reservas_com_rotas_ativas,
    COUNT(CASE WHEN r.is_active = false THEN 1 END) as reservas_com_rotas_inativas
FROM reservations res
LEFT JOIN routes r ON res.route_id = r.id;

# Insights de Diseño: Animaciones, Motion y UX/UI Premium para Restaurantes Fine Dining

## Resumen
Investigación sobre tendencias visuales animadas y experiencias interactivas para sitios web de restaurantes premium.

---

## 1. Patrones de Experiencia Inmersiva

### Interacción Guía (Immersive Interaction)
- **Objetivo**: Incrementar engagement en un 40%
- **Trade-off**: Requiere consideraciones de performance
- **Obligatorio**: Incluir opción de跳过（skip） para usuarios impacientes + móvil fallback

### Estructura Recomendada:
1. Elemento interactivo full-screen inicial
2. Tour guiado por producto/experiencia
3. Beneficios clave revelados progresivamente
4. CTA después de completar interacción

---

## 2. Estilo Líquido Glass (Liquid Glass)

### Características:
- Efectos visuales: flowing glass, morphing, smooth transitions
- Blur dinámico con backdrop-filter
- Efectos iridiscentes y aberración cromática sutil

### Compatibilidad: Light mode ✓ | Dark mode ✓ (full)

### Performance & Accesibilidad:
- ⚠ Moderate to Poor performance scores
- ⚠ Text contrast needs attention (WCAG compliance)

### Mejor para:
Premium SaaS, e-commerce luxury, creative platforms, branding experiences, luxury portfolios

---

## 3. Sistema de Color Premium

| Uso      | Hex   | Variable CSS        |
|----------|-------|---------------------|
| Primario    | `#1C1917`     | `--color-primary`        |
| Surtitulos (on primary)| `#FFFFFF`     | `--color-on-primary`     |
| Secundario  | `#44403C`     | `--color-secondary`      |
| Acento/CTA   | `#A16207`     | `--color-accent`         |
| Background   | `#FAFAF9`     | `--color-background`     |
| Foreground  | `#0C0A09`     | `--color-foreground`     |
| Muted        | `#E8ECF0`     | `--color-muted`          |
| Border       | `#D6D3D1`     | `--color-border`         |
| Ring         | `#1C1917`     | `--color-ring`           |

**Nota**: Ajuste del color acento desde #CA8A04 → #A16207 para cumplir WCAG 3:1 contrast ratio.

---

## 4. Tipografía Luxury Minimalist

### Fuentes:
- **Bodoni Moda** + **Jost** de Google Fonts
- Mood: luxury, minimalist, high-end, sophisticated, refined, premium

### Variantes disponibles |wght@400;500;600;700 para Bodoni Moda / Jost

### Import CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap');
```

---

## 5. Efectos Clave a Implementar

1. **Elementos morphing** - SVG y CSS transforms
2. **Fluid animations** - Curvas de tiempo 400-600ms
3. **Dynamic blur** - backdrop-filter en glass effects
4. **Color transitions** - Suaves y coherentes con el sistema

---

## 6. Checklist Pre-Entrega

- [ ] Sin emojis (usar SVG: Heroicons/Lucide)
- [ ] `cursor-pointer` en todos los elementos clicables
- [ ] Estado hover con transiciones suaves 150-300ms
- [ ] Light mode: text contrast mínimo 4.5:1
- [ ] Focus states visibles para navegación por teclado
- [ ] `prefers-reduced-motion` respetado
- [ ] Responsive: 375px, 768px, 1024px, 1440px breakpoints

---

## 7. A Evitar

❌ Visuals baratos + animaciones rápidas  
❌ Over-engineering sin value real a la experiencia  
❌ Animaciones que afectan legibilidad  

---
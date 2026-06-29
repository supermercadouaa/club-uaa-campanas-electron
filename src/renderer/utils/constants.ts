export const COLORS = {
  primary: '#5A3E7F',
  primaryLight: '#6F52A0',
  primaryLighter: '#8464B8',
  bg: '#2D1B47',
  surface: '#3D2A5A',
  surface2: '#4A3668',
  border: '#5A3E7F',
  border2: '#6F52A0',
  accent: '#FFFFFF',
  accent2: '#E0E0E0',
  text: '#FFFFFF',
  muted: '#B0B0B0',
  muted2: '#9A9A9A',
  danger: '#FF4444',
  success: '#00CC88',
  warning: '#FFB800',
  wa: '#25D366',
  wa2: '#1EB558',
};

export const TEMPLATES = [
  {
    id: 'ofertas_3_desc',
    name: '3 Destacados + Descuentos',
    subtitle: 'Ofertas quincenales',
    icon: '%',
    body: `Hola {{nombre}},\n\n¡No te pierdas nuestras SUPER OFERTAS! Aprovechá nuestras ofertas destacadas:\n\n{{prod_1}}: {{precio_1}} → {{oferta_1}} (-{{dscto_1}}%)\n{{prod_2}}: {{precio_2}} → {{oferta_2}} (-{{dscto_2}}%)\n{{prod_3}}: {{precio_3}} → {{oferta_3}} (-{{dscto_3}}%)\n\nVer el catálogo completo de ofertas: {{link_catálogo_personalizado}}\n\n¡Hasta pronto!\nEquipo Club UAA`,
    variables: ['prod_1', 'precio_1', 'oferta_1', 'dscto_1', 'prod_2', 'precio_2', 'oferta_2', 'dscto_2', 'prod_3', 'precio_3', 'oferta_3', 'dscto_3', 'link_catálogo_personalizado']
  },
  {
    id: 'ofertas_3',
    name: '3 Destacados',
    subtitle: 'Ofertas Quincenales',
    icon: '🎁',
    body: `Hola {{nombre}},\n\n¡No te pierdas nuestras SUPER OFERTAS! Aprovechá nuestras ofertas destacadas:\n\n{{prod_1}}: {{precio_1}} → {{oferta_1}}\n{{prod_2}}: {{precio_2}} → {{oferta_2}}\n{{prod_3}}: {{precio_3}} → {{oferta_3}}\n\nVer el catálogo completo de ofertas: {{link_catálogo_personalizado}}\n\n¡Hasta pronto!\nEquipo Club UAA`,
    variables: ['prod_1', 'precio_1', 'oferta_1', 'prod_2', 'precio_2', 'oferta_2', 'prod_3', 'precio_3', 'oferta_3', 'link_catálogo_personalizado']
  },
  {
    id: 'ofertas_catalogo',
    name: 'Link al catálogo',
    subtitle: 'Ofertas Quincenales',
    icon: '🔗',
    body: `Hola {{nombre}},\n\n¡No te pierdas nuestras SUPER OFERTAS! Consulta todas las ofertas vigentes en el siguiente {{link_catálogo_personalizado}}\n\n¡Hasta pronto!\nEquipo Club UAA`,
    variables: ['link_catálogo_personalizado']
  }
];

export const FIELD_ALIASES = {
  telefono: ['telefono', 'celular', 'phone', 'whatsapp', 'x_telefono', 'x_celular', 'tel', 'movil', 'móvil', 'telefono_celular'],
  nombre: ['nombre', 'apellido y nombre', 'apellido_nombre', 'name', 'apellido', 'x_nombres', 'cliente']
};

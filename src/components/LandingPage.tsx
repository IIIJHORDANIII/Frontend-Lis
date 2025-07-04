import React from "react";
import { Box, Button, Typography, Stack, Card, CardContent, Avatar, Grid, Fade, Fab, useTheme, useMediaQuery } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from "react-router-dom";

// SVG Illustration Placeholder
const DashboardMockup = () => (
  <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 420 }, mx: 'auto' }}>
    <svg width="100%" height="220" viewBox="0 0 420 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="400" height="180" rx="24" fill="url(#paint0_linear)" opacity="0.9"/>
      <rect x="40" y="60" width="340" height="40" rx="10" fill="#fff" opacity="0.7"/>
      <rect x="40" y="110" width="220" height="20" rx="6" fill="#fff" opacity="0.5"/>
      <rect x="40" y="140" width="120" height="20" rx="6" fill="#fff" opacity="0.3"/>
      <rect x="180" y="140" width="100" height="20" rx="6" fill="#fff" opacity="0.3"/>
      <defs>
        <linearGradient id="paint0_linear" x1="10" y1="20" x2="410" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a1a1a"/>
          <stop offset="1" stopColor="#2d3748"/>
        </linearGradient>
      </defs>
    </svg>
  </Box>
);

const features = [
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#4a5568"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: "Gestão Inteligente",
    desc: "Automatize processos e otimize o controle de estoque com tecnologia de ponta."
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#2d3748"/><path d="M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Interface Intuitiva",
    desc: "Design pensado para facilitar o uso, com navegação simples e eficiente."
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="5" fill="#718096"/><path d="M7 12h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Segurança Avançada",
    desc: "Seus dados protegidos com criptografia e autenticação robusta."
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#a0aec0"/><path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Relatórios Dinâmicos",
    desc: "Visualize resultados em tempo real com dashboards interativos."
  },
];

const testimonials = [
  {
    name: "Ana Souza",
    role: "Gerente de Operações",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "A plataforma revolucionou nossa gestão de estoque. Simples, rápida e confiável!"
  },
  {
    name: "Carlos Lima",
    role: "Diretor Financeiro",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Os relatórios dinâmicos nos deram uma visão estratégica inédita."
  },
  {
    name: "Juliana Alves",
    role: "Analista de TI",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "A segurança e facilidade de uso são diferenciais claros. Recomendo!"
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [testimonialIdx, setTestimonialIdx] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx((idx) => (idx + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppClick = () => {
    const message = "Olá! Gostaria de saber mais sobre a plataforma de gestão de estoque.";
    const whatsappUrl = `https://wa.me/5546999019800?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      position: 'relative',
      fontFamily: 'Poppins, Inter, Montserrat, Arial',
      display: 'flex',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 50%, #e2e8f0 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradientMove 12s ease-in-out infinite',
      '@keyframes gradientMove': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
    }}>
      <Box sx={{
        width: '90vw',
        maxWidth: '1400px',
        position: 'relative',
        '@media (max-width: 600px)': {
          width: '95vw',
        },
      }}>

      {/* WhatsApp Floating Button */}
      <Fab
        color="primary"
        aria-label="WhatsApp"
        onClick={handleWhatsAppClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1000,
          background: '#25D366',
          color: '#fff',
          width: { xs: 56, sm: 60 },
          height: { xs: 56, sm: 60 },
          boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: '#128C7E',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(37, 211, 102, 0.5), 0 6px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
      </Fab>

      {/* Hero Section */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3, md: 10 },
        pt: { xs: 8, sm: 10, md: 16 },
        pb: { xs: 4, sm: 6, md: 10 },
        minHeight: { xs: 'auto', md: '70vh' },
        gap: { xs: 4, md: 0 },
      }}>
        <Box sx={{ 
          flex: 1, 
          color: '#2d3748', 
          pr: { md: 8 }, 
          mb: { xs: 4, md: 0 },
          textAlign: { xs: 'center', md: 'left' },
        }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }, 
              lineHeight: 1.1, 
              mb: 2, 
              letterSpacing: -1,
              '@media (max-width: 600px)': {
                fontSize: '1.75rem',
              },
            }}
          >
            Gestão de Estoque <span style={{ color: '#4a5568' }}>Profissional</span> para Empresas Modernas
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 400, 
              color: '#718096', 
              mb: 4, 
              maxWidth: 520,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              mx: { xs: 'auto', md: 0 },
            }}
          >
            Controle total, insights em tempo real e segurança de alto nível. Transforme sua operação com tecnologia de ponta.
          </Typography>
          <Button
            size="large"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 1.5, sm: 1.6, md: 1.8 },
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              borderRadius: 3,
              background: 'linear-gradient(90deg, #2d3748 0%, #4a5568 100%)',
              color: '#fff',
              boxShadow: '0 4px 24px 0 rgba(45,55,72,0.15)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                background: 'linear-gradient(90deg, #4a5568 0%, #2d3748 100%)',
              },
            }}
            onClick={() => navigate('/login')}
          >
            {isSmallMobile ? 'Entrar' : 'Entrar na Plataforma'}
          </Button>
        </Box>
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          order: { xs: -1, md: 0 },
        }}>
          <Box sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 6,
            boxShadow: '0 8px 40px 0 rgba(0,0,0,0.08)',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)',
            maxWidth: { xs: 300, sm: 420 },
            mx: 'auto',
            width: '100%',
          }}>
            <DashboardMockup />
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 1, sm: 2, md: 6 },
        py: { xs: 4, sm: 6, md: 8 },
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        },
        gap: { xs: 2, sm: 3, md: 4 },
      }}>
        {features.map((f, i) => (
          <Card key={i} elevation={0} sx={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 5,
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#2d3748',
            minHeight: { xs: 160, sm: 180 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.18s',
            '&:hover': { 
              transform: 'translateY(-6px) scale(1.04)', 
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)' 
            },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 2, sm: 2 },
          }}>
            <Box sx={{ mb: 2 }}>{f.icon}</Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.125rem' },
                textAlign: 'center',
              }}
            >
              {f.title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#718096', 
                textAlign: 'center',
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              }}
            >
              {f.desc}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Testimonials Section */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 900,
        mx: 'auto',
        px: { xs: 1, sm: 2, md: 6 },
        py: { xs: 4, sm: 6, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#2d3748', 
            fontWeight: 700, 
            mb: 4, 
            letterSpacing: 0.5,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            textAlign: 'center',
          }}
        >
          O que nossos clientes dizem
        </Typography>
        <Fade in timeout={800} key={testimonialIdx}>
          <Card elevation={0} sx={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 5,
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#2d3748',
            minWidth: { xs: '280px', sm: '400px', md: '480px' },
            minHeight: { xs: 120, sm: 140 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3 },
            textAlign: 'center',
          }}>
            <Avatar 
              src={testimonials[testimonialIdx].avatar} 
              sx={{ 
                width: { xs: 48, sm: 56 }, 
                height: { xs: 48, sm: 56 }, 
                mb: 2, 
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)' 
              }} 
            />
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500, 
                mb: 1, 
                color: '#2d3748',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              "{testimonials[testimonialIdx].text}"
            </Typography>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#4a5568', 
                fontWeight: 700,
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              }}
            >
              {testimonials[testimonialIdx].name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#718096',
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              }}
            >
              {testimonials[testimonialIdx].role}
            </Typography>
          </Card>
        </Fade>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 900,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 4, sm: 6, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #2d3748 0%, #4a5568 100%)',
        borderRadius: 6,
        boxShadow: '0 4px 32px 0 rgba(45,55,72,0.1)',
        mt: { xs: 6, sm: 8 },
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#fff', 
            fontWeight: 800, 
            mb: 2, 
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          }}
        >
          Pronto para transformar sua gestão?
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#e2e8f0', 
            fontWeight: 400, 
            mb: 4, 
            textAlign: 'center',
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
          }}
        >
          Experimente a plataforma e leve sua empresa para o próximo nível.
        </Typography>
        <Button
          size="large"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: { xs: 3, sm: 4, md: 5 },
            py: { xs: 1.5, sm: 1.6, md: 1.8 },
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            borderRadius: 3,
            background: '#fff',
            color: '#2d3748',
            boxShadow: '0 4px 24px 0 rgba(45,55,72,0.15)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              background: '#f7fafc',
              color: '#2d3748',
            },
          }}
          onClick={() => navigate('/login')}
        >
          Começar agora
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        mt: { xs: 8, sm: 10 },
        py: { xs: 3, sm: 4 },
        px: 2,
        textAlign: 'center',
        color: '#718096',
        fontSize: { xs: 14, sm: 16 },
        letterSpacing: 0.2,
      }}>
        <Box sx={{ mb: 2 }}>
          <Button
            component="a"
            href="/privacy"
            sx={{
              color: '#718096',
              textDecoration: 'none',
              fontSize: { xs: 12, sm: 14 },
              fontWeight: 500,
              '&:hover': {
                color: '#2d3748',
                textDecoration: 'underline',
              },
            }}
          >
            Política de Privacidade
          </Button>
        </Box>
        &copy; {new Date().getFullYear()} Plataforma de Gestão. Todos os direitos reservados.
      </Box>
      </Box>
    </Box>
  );
};

export default LandingPage; 
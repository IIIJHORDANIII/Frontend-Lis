import React from "react";
import { Box, Button, Typography, Stack, Card, CardContent, Avatar, Grid, Fade, Fab, useTheme, useMediaQuery, alpha } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from "react-router-dom";
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

// SVG Illustration Placeholder
const DashboardMockup = ({ isDark }: { isDark: boolean }) => (
  <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 420 }, mx: 'auto' }}>
    <svg width="100%" height="220" viewBox="0 0 420 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="400" height="180" rx="24" fill="url(#paint0_linear)" opacity="0.9"/>
      <rect x="40" y="60" width="340" height="40" rx="10" fill={isDark ? "#4a5568" : "#fff"} opacity="0.7"/>
      <rect x="40" y="110" width="220" height="20" rx="6" fill={isDark ? "#4a5568" : "#fff"} opacity="0.5"/>
      <rect x="40" y="140" width="120" height="20" rx="6" fill={isDark ? "#4a5568" : "#fff"} opacity="0.3"/>
      <rect x="180" y="140" width="100" height="20" rx="6" fill={isDark ? "#4a5568" : "#fff"} opacity="0.3"/>
      <defs>
        <linearGradient id="paint0_linear" x1="10" y1="20" x2="410" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor={isDark ? "#1a202c" : "#1a1a1a"}/>
          <stop offset="1" stopColor={isDark ? "#2d3748" : "#2d3748"}/>
        </linearGradient>
      </defs>
    </svg>
  </Box>
);

const features = [
  {
    icon: (isDark: boolean) => (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill={isDark ? "#667eea" : "#4a5568"}/>
        <path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Gestão Inteligente",
    desc: "Automatize processos e otimize o controle de estoque com tecnologia de ponta."
  },
  {
    icon: (isDark: boolean) => (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4" fill={isDark ? "#667eea" : "#2d3748"}/>
        <path d="M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Interface Intuitiva",
    desc: "Design pensado para facilitar o uso, com navegação simples e eficiente."
  },
  {
    icon: (isDark: boolean) => (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="10" rx="5" fill={isDark ? "#a0aec0" : "#718096"}/>
        <path d="M7 12h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Segurança Avançada",
    desc: "Seus dados protegidos com criptografia e autenticação robusta."
  },
  {
    icon: (isDark: boolean) => (
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="8" fill={isDark ? "#a0aec0" : "#a0aec0"}/>
        <path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
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
  const { isDark } = useAppTheme();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [testimonialIdx, setTestimonialIdx] = React.useState(0);

  // Redirecionamento automático para usuários já logados
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/products');
      } else {
        navigate('/sales');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

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

  // Não renderizar se estiver carregando ou se o usuário estiver logado
  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      position: 'relative',
      fontFamily: 'Poppins, Inter, Montserrat, Arial',
      display: 'flex',
      justifyContent: 'center',
      background: theme.customColors.background.gradient,
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
        px: { xs: 2, sm: 3, md: 6, lg: 8, xl: 10 },
        pt: { xs: 10, sm: 12, md: 16, lg: 20, xl: 24 },
        pb: { xs: 6, sm: 8, md: 12, lg: 16, xl: 20 },
        minHeight: { xs: 'auto', md: '80vh' },
        gap: { xs: 6, md: 0 },
      }}>
        <Box sx={{ 
          flex: 1, 
          color: theme.customColors.text.primary, 
          pr: { md: 8, lg: 10, xl: 12 }, 
          mb: { xs: 6, md: 0 },
          textAlign: { xs: 'center', md: 'left' },
        }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem', lg: '3.75rem', xl: '4.25rem' }, 
              lineHeight: 1.1, 
              mb: 3, 
              letterSpacing: -1,
              '@media (max-width: 600px)': {
                fontSize: '2rem',
              },
            }}
          >
            Gestão de Estoque <span style={{ color: theme.customColors.text.secondary }}>Profissional</span> para Empresas Modernas
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 400, 
              color: theme.customColors.text.secondary, 
              mb: 6, 
              maxWidth: 600,
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem', lg: '1.5rem', xl: '1.625rem' },
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
              px: { xs: 4, sm: 5, md: 6, lg: 7, xl: 8 },
              py: { xs: 1.75, sm: 2, md: 2.25, lg: 2.5, xl: 2.75 },
              fontWeight: 700,
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem', lg: '1.5rem', xl: '1.625rem' },
              borderRadius: 4,
              background: `linear-gradient(90deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
              color: theme.customColors.text.inverse,
              boxShadow: theme.customColors.shadow.secondary,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                background: `linear-gradient(90deg, ${theme.customColors.primary.light} 0%, ${theme.customColors.primary.main} 100%)`,
                boxShadow: theme.customColors.shadow.primary,
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
            p: { xs: 3, sm: 4, md: 5, lg: 6 },
            borderRadius: 6,
            boxShadow: theme.customColors.shadow.primary,
            background: theme.customColors.surface.card,
            backdropFilter: 'blur(16px)',
            border: `1px solid ${theme.customColors.border.primary}`,
            maxWidth: { xs: 350, sm: 450, md: 500, lg: 550, xl: 600 },
            mx: 'auto',
            width: '100%',
          }}>
            <DashboardMockup isDark={isDark} />
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        py: { xs: 8, sm: 10, md: 12, lg: 16, xl: 20 },
        px: { xs: 2, sm: 3, md: 6, lg: 8, xl: 10 },
      }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10, lg: 12 } }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              color: theme.customColors.text.primary, 
              mb: 3,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem', xl: '4rem' },
            }}
          >
            Recursos Principais
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.customColors.text.secondary, 
              maxWidth: 700,
              mx: 'auto',
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem', lg: '1.5rem' },
            }}
          >
            Tudo que você precisa para gerenciar seu estoque de forma eficiente
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 4,
          maxWidth: 1200,
          mx: 'auto'
        }}>
          {features.map((feature, index) => (
            <Box key={index}>
              <Card sx={{
                p: { xs: 3, sm: 4, md: 5 },
                height: '100%',
                textAlign: 'center',
                background: theme.customColors.surface.card,
                backdropFilter: 'blur(12px)',
                border: `1px solid ${theme.customColors.border.primary}`,
                borderRadius: 4,
                boxShadow: theme.customColors.shadow.secondary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.customColors.shadow.primary,
                }
              }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  {feature.icon(isDark)}
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    color: theme.customColors.text.primary,
                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.customColors.text.secondary,
                    fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                  }}
                >
                  {feature.desc}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>
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
            color: theme.customColors.text.primary, 
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
            background: theme.customColors.surface.card,
            backdropFilter: 'blur(10px)',
            borderRadius: 5,
            boxShadow: theme.customColors.shadow.secondary,
            border: `1px solid ${theme.customColors.border.primary}`,
            color: theme.customColors.text.primary,
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
                boxShadow: theme.customColors.shadow.secondary
              }} 
            />
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500, 
                mb: 1, 
                color: theme.customColors.text.primary,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              "{testimonials[testimonialIdx].text}"
            </Typography>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.customColors.text.secondary, 
                fontWeight: 700,
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              }}
            >
              {testimonials[testimonialIdx].name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.customColors.text.secondary,
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
        background: `linear-gradient(90deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
        borderRadius: 6,
        boxShadow: theme.customColors.shadow.primary,
        mt: { xs: 6, sm: 8 },
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: theme.customColors.text.inverse, 
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
            color: alpha(theme.customColors.text.inverse, 0.9), 
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
            background: theme.customColors.surface.primary,
            color: theme.customColors.text.primary,
            boxShadow: theme.customColors.shadow.secondary,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              background: alpha(theme.customColors.surface.primary, 0.9),
              color: theme.customColors.text.primary,
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
        color: theme.customColors.text.secondary,
        fontSize: { xs: 14, sm: 16 },
        letterSpacing: 0.2,
      }}>
        <Box sx={{ mb: 2 }}>
          <Button
            component="a"
            href="/privacy"
            sx={{
              color: theme.customColors.text.secondary,
              textDecoration: 'none',
              fontSize: { xs: 12, sm: 14 },
              fontWeight: 500,
              '&:hover': {
                color: theme.customColors.text.primary,
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
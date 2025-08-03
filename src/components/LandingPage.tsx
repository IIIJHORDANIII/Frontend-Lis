import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  Stack, 
  Card, 
  CardContent, 
  Avatar, 
  Grid, 
  Fade, 
  Fab, 
  useTheme, 
  useMediaQuery, 
  alpha,
  Container,
  Chip,
  Divider,
  IconButton,
  Paper,
  Grow,
  Zoom,
  Slide
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  WhatsApp as WhatsAppIcon,
  Store as StoreIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  List as ListIcon,
  Assignment as AssignmentIcon,
  CloudUpload as CloudUploadIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  PlayArrow as PlayArrowIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Rocket as RocketIcon,
  Diamond as DiamondIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

// Componente de estatísticas animadas
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <Typography
      variant="h2"
      sx={{
        fontWeight: 800,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
      }}
    >
      {count}{suffix}
    </Typography>
  );
};

// Features principais do sistema
const mainFeatures = [
  {
    icon: <StoreIcon sx={{ fontSize: 40 }} />,
    title: "Gestão de Estoque Inteligente",
    description: "Controle total do seu inventário com atualizações em tempo real, alertas de estoque baixo e categorização automática.",
    color: "#667eea",
    benefits: ["Controle em tempo real", "Alertas automáticos", "Categorização inteligente"]
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    title: "Sistema de Vendas Avançado",
    description: "Registre vendas, controle comissões automaticamente e acompanhe o desempenho da sua equipe de vendas.",
    color: "#38a169",
    benefits: ["Comissões automáticas", "Relatórios detalhados", "Controle de devoluções"]
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    title: "Gestão de Vendedores",
    description: "Gerencie sua equipe de vendas com perfis personalizados, controle de acesso e acompanhamento individual.",
    color: "#ed8936",
    benefits: ["Perfis personalizados", "Controle de acesso", "Acompanhamento individual"]
  },
  {
    icon: <ListIcon sx={{ fontSize: 40 }} />,
    title: "Listas Customizadas",
    description: "Crie listas personalizadas de produtos, compartilhe com vendedores e controle reservas de estoque.",
    color: "#9f7aea",
    benefits: ["Listas personalizadas", "Compartilhamento", "Reservas de estoque"]
  }
];

// Funcionalidades técnicas
const technicalFeatures = [
  {
    icon: <CloudUploadIcon />,
    title: "Upload de Imagens",
    description: "Sistema integrado com AWS S3 para armazenamento seguro e rápido de imagens dos produtos."
  },
  {
    icon: <AutoAwesomeIcon />,
    title: "Cálculos Automáticos",
    description: "Preços, comissões e lucros calculados automaticamente baseados no preço de custo."
  },
  {
    icon: <SecurityIcon />,
    title: "Segurança Avançada",
    description: "Autenticação JWT, criptografia de dados e controle de acesso por perfil."
  },
  {
    icon: <SpeedIcon />,
    title: "Performance Otimizada",
    description: "Interface responsiva, carregamento rápido e experiência fluida em todos os dispositivos."
  }
];

// Depoimentos
const testimonials = [
  {
    name: "Ana Silva",
    role: "Proprietária - Boutique Elegance",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "O LIS MODAS revolucionou nossa gestão. Antes perdíamos muito tempo com planilhas, agora tudo é automático e preciso!",
    rating: 5
  },
  {
    name: "Carlos Mendes",
    role: "Gerente de Vendas - Fashion Store",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "O sistema de comissões automáticas e relatórios detalhados nos deu uma visão estratégica que nunca tivemos antes.",
    rating: 5
  },
  {
    name: "Juliana Costa",
    role: "Vendedora - Moda & Estilo",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Interface intuitiva e fácil de usar. Consigo gerenciar minhas vendas e comissões sem complicação!",
    rating: 5
  }
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const { isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Rotação automática dos depoimentos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Não renderizar apenas se estiver carregando
  if (isLoading) {
    return null;
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá! Gostaria de saber mais sobre o sistema LIS MODAS para gestão de estoque e vendas.");
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/products' : '/sales');
    } else {
      navigate('/login');
    }
  };

  const handleScrollToFeatures = () => {
    console.log('Botão clicado!'); // Debug
    const featuresSection = document.getElementById('features-section');
    console.log('Elemento encontrado:', featuresSection); // Debug
    
    if (featuresSection) {
      console.log('Fazendo scroll...'); // Debug
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.log('Elemento não encontrado!'); // Debug
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      position: 'relative',
      fontFamily: 'Poppins, Inter, Montserrat, Arial',
      display: 'flex',
      flexDirection: 'column',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientMove 30s ease-in-out infinite',
      '@keyframes gradientMove': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        pointerEvents: 'none',
      }
          }}>
      
      {/* Elementos flutuantes decorativos */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: 20,
        height: 20,
        background: 'rgba(102, 126, 234, 0.3)',
        borderRadius: '50%',
        zIndex: 1,
        pointerEvents: 'none',
        animation: 'float1 6s ease-in-out infinite',
        '@keyframes float1': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(180deg)' },
        }
      }} />
      
      <Box sx={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: 15,
        height: 15,
        background: 'rgba(240, 147, 251, 0.4)',
        borderRadius: '50%',
        zIndex: 1,
        pointerEvents: 'none',
        animation: 'float2 8s ease-in-out infinite',
        '@keyframes float2': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-40px) scale(1.5)' },
        }
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '30%',
        left: '15%',
        width: 25,
        height: 25,
        background: 'rgba(118, 75, 162, 0.3)',
        borderRadius: '50%',
        zIndex: 1,
        pointerEvents: 'none',
        animation: 'float3 7s ease-in-out infinite',
        '@keyframes float3': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-25px) rotate(90deg)' },
        }
      }} />
      
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
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: '#fff',
          width: { xs: 56, sm: 60 },
          height: { xs: 56, sm: 60 },
          boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { 
              transform: 'scale(1)',
              boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)'
            },
            '50%': { 
              transform: 'scale(1.05)',
              boxShadow: '0 12px 40px rgba(37, 211, 102, 0.6), 0 6px 20px rgba(0, 0, 0, 0.15)'
            },
          },
          '&:hover': {
            background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
            transform: 'scale(1.15)',
            boxShadow: '0 15px 50px rgba(37, 211, 102, 0.7), 0 8px 25px rgba(0, 0, 0, 0.2)',
            animation: 'none',
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3, md: 6, lg: 8, xl: 10 },
        pt: { xs: 12, sm: 16, md: 20, lg: 24, xl: 28 },
        pb: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 },
        minHeight: '100vh',
        textAlign: 'center',
      }}>
        
        {/* Logo e Título Principal */}
        <Zoom in timeout={1200}>
          <Box sx={{ mb: 6, position: 'relative' }}>
            {/* Efeitos de brilho múltiplos atrás do logo */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 300, sm: 400, md: 500 },
              height: { xs: 300, sm: 400, md: 500 },
              background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 30%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              animation: 'glow 4s ease-in-out infinite alternate',
              '@keyframes glow': {
                '0%': { opacity: 0.3, transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' },
                '100%': { opacity: 0.8, transform: 'translate(-50%, -50%) scale(1.2) rotate(180deg)' },
              }
            }} />
            
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 200, sm: 250, md: 300 },
              height: { xs: 200, sm: 250, md: 300 },
              background: 'radial-gradient(circle, rgba(240, 147, 251, 0.2) 0%, transparent 60%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              animation: 'glow2 3s ease-in-out infinite alternate-reverse',
              '@keyframes glow2': {
                '0%': { opacity: 0.2, transform: 'translate(-50%, -50%) scale(0.8) rotate(0deg)' },
                '100%': { opacity: 0.6, transform: 'translate(-50%, -50%) scale(1.1) rotate(-180deg)' },
              }
            }} />
            
            <Box
              component="img"
              src="/Logo Vector.png"
              alt="LIS MODAS Logo"
              sx={{
                height: { xs: 80, sm: 100, md: 120, lg: 140 },
                width: 'auto',
                mb: 4,
                animation: 'float 4s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                  '25%': { transform: 'translateY(-15px) rotate(1deg)' },
                  '50%': { transform: 'translateY(-20px) rotate(0deg)' },
                  '75%': { transform: 'translateY(-15px) rotate(-1deg)' },
                },
                position: 'relative',
                zIndex: 2,
                filter: theme.palette.mode === 'dark' 
                  ? 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.3))' 
                  : 'drop-shadow(0 0 20px rgba(0,0,0,0.1))',
              }}
            />
            

            
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#4a5568', 
                mb: 4, 
                mt: 2,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' },
                lineHeight: 1.3,
                position: 'relative',
                zIndex: 2,
              }}
            >
              Sistema Completo de Gestão para Moda
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 400, 
                color: theme.palette.mode === 'dark' ? '#a0aec0' : '#718096', 
                mb: 6, 
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: '800px',
                mx: 'auto',
                position: 'relative',
                zIndex: 2,
              }}
            >
              Revolucione sua loja de roupas com o sistema mais completo do mercado. 
              Gestão de estoque, vendas, comissões e relatórios tudo em uma única plataforma.
            </Typography>
          </Box>
        </Zoom>

        {/* Botões de Ação */}
        <Grow in timeout={1800}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            sx={{ mb: 8, position: 'relative', zIndex: 10 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              startIcon={isAuthenticated ? <StoreIcon /> : <RocketIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundSize: '200% 200%',
                color: '#fff',
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.125rem' },
                px: { xs: 4, sm: 6 },
                py: { xs: 1.5, sm: 2 },
                borderRadius: 1,
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                animation: 'gradientShift 3s ease-in-out infinite',
                '@keyframes gradientShift': {
                  '0%, 100%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.05)',
                  boxShadow: '0 20px 60px rgba(102, 126, 234, 0.6), 0 0 0 1px rgba(255,255,255,0.1)',
                  '&::before': {
                    left: '100%',
                  },
                  '&::after': {
                    opacity: 1,
                  },
                }
              }}
            >
              {isAuthenticated ? (isAdmin ? 'Acessar Admin' : 'Acessar Sistema') : 'Começar Agora'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={isAuthenticated ? logout : handleScrollToFeatures}
              endIcon={isAuthenticated ? <LogoutIcon /> : <KeyboardArrowDownIcon />}
              sx={{
                borderColor: theme.palette.mode === 'dark' ? '#667eea' : '#667eea',
                color: theme.palette.mode === 'dark' ? '#667eea' : '#667eea',
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.125rem' },
                px: { xs: 4, sm: 6 },
                py: { xs: 1.5, sm: 2 },
                borderRadius: 1,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  borderColor: theme.palette.mode === 'dark' ? '#764ba2' : '#764ba2',
                  color: theme.palette.mode === 'dark' ? '#764ba2' : '#764ba2',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 15px 50px rgba(102, 126, 234, 0.2)',
                  '&::before': {
                    left: '100%',
                  },
                }
              }}
            >
              {isAuthenticated ? 'Sair' : 'Conhecer Funcionalidades'}
            </Button>
          </Stack>
        </Grow>

        {/* Scroll Indicator */}
        <Slide direction="up" in timeout={2500}>
          <Box sx={{ 
            position: 'absolute', 
            bottom: 40, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 10,
            animation: 'floatArrow 2s ease-in-out infinite',
            '@keyframes floatArrow': {
              '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
              '50%': { transform: 'translateX(-50%) translateY(-15px)' },
            }
          }}>
            <Box 
              onClick={handleScrollToFeatures}
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(102, 126, 234, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                },
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.2)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)',
                }
              }}
            >
              <KeyboardArrowDownIcon sx={{ 
                fontSize: 24, 
                color: theme.palette.mode === 'dark' ? '#667eea' : '#667eea',
                animation: 'arrowGlow 2s ease-in-out infinite',
                '@keyframes arrowGlow': {
                  '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(102, 126, 234, 0.3))' },
                  '50%': { filter: 'drop-shadow(0 0 15px rgba(102, 126, 234, 0.6))' },
                }
              }} />
            </Box>
          </Box>
        </Slide>
      </Box>

      {/* Features Section */}
      <Box id="features-section" sx={{ 
        position: 'relative', 
        zIndex: 2, 
        pt: { xs: 12, sm: 16, md: 20, lg: 24 }, // Padding-top extra para compensar o header
        pb: { xs: 8, sm: 12, md: 16, lg: 20 },
        px: { xs: 2, sm: 3, md: 6, lg: 8, xl: 10 },
        scrollMarginTop: { xs: '100px', sm: '120px', md: '140px' }, // Margem para scroll
      }}>
        <Container maxWidth="xl">
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                color: theme.palette.mode === 'dark' ? '#f7fafc' : '#2d3748',
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                lineHeight: 1.2,
              }}
            >
              Funcionalidades Principais
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? '#a0aec0' : '#718096',
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                lineHeight: 1.6,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Tudo que você precisa para gerenciar sua loja de roupas de forma profissional
            </Typography>
          </Box>

          {/* Main Features Grid */}
          <Grid container spacing={4} sx={{ mb: { xs: 8, sm: 12, md: 16 } }}>
            {mainFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Grow in timeout={1200 + index * 300}>
                  <Card
                    sx={{
                      height: '100%',
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: 1,
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}80 100%)`,
                        transform: 'scaleX(0)',
                        transition: 'transform 0.4s ease',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at 50% 0%, ${feature.color}10 0%, transparent 70%)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-15px) scale(1.03)',
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px ${feature.color}30`
                          : `0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px ${feature.color}20`,
                        '&::before': {
                          transform: 'scaleX(1)',
                        },
                        '&::after': {
                          opacity: 1,
                        },
                        '& .feature-icon': {
                          transform: 'scale(1.2) rotate(10deg)',
                          filter: `drop-shadow(0 0 25px ${feature.color}50)`,
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        color: feature.color 
                      }}>
                        <Box className="feature-icon" sx={{
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {feature.icon}
                        </Box>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700, 
                            ml: 2,
                            color: 'inherit',
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                          }}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                          mb: 3,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                      
                      <Stack spacing={1}>
                        {feature.benefits.map((benefit, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                            <CheckCircleIcon sx={{ 
                              color: feature.color, 
                              fontSize: 20, 
                              mr: 1 
                            }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: theme.palette.mode === 'dark' ? '#cbd5e0' : '#2d3748',
                                fontWeight: 500,
                              }}
                            >
                              {benefit}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>

          {/* Technical Features */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.mode === 'dark' ? '#f7fafc' : '#2d3748',
                mb: 4,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem' },
              }}
            >
              Tecnologia de Ponta
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {technicalFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in timeout={1400 + index * 200}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: 1,
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 15px 45px rgba(0, 0, 0, 0.4)'
                          : '0 15px 45px rgba(0, 0, 0, 0.15)',
                        '&::before': {
                          opacity: 1,
                        },
                        '& .tech-icon': {
                          transform: 'scale(1.2) rotate(10deg)',
                          filter: 'drop-shadow(0 0 15px rgba(102, 126, 234, 0.5))',
                        }
                      }
                    }}
                  >
                    <Box className="tech-icon" sx={{ 
                      color: '#667eea', 
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                    }}>
                      {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        color: theme.palette.mode === 'dark' ? '#f7fafc' : '#2d3748',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                        lineHeight: 1.5,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box id="stats-section" sx={{ 
        position: 'relative', 
        zIndex: 2, 
        py: { xs: 8, sm: 12, md: 16 },
        px: { xs: 2, sm: 3, md: 6, lg: 8, xl: 10 },
        background: theme.palette.mode === 'dark' 
          ? 'rgba(26, 32, 44, 0.8)' 
          : 'rgba(237, 242, 247, 0.8)',
        backdropFilter: 'blur(20px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 2,
          height: 2,
          background: 'rgba(102, 126, 234, 0.6)',
          borderRadius: '50%',
          animation: 'particle1 8s ease-in-out infinite',
          '@keyframes particle1': {
            '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: 0.6 },
            '50%': { transform: 'translateY(-50px) scale(1.5)', opacity: 1 },
          }
        }
      }}>
        {/* Partículas flutuantes */}
        <Box sx={{
          position: 'absolute',
          top: '40%',
          right: '15%',
          width: 3,
          height: 3,
          background: 'rgba(240, 147, 251, 0.7)',
          borderRadius: '50%',
          animation: 'particle2 10s ease-in-out infinite',
          '@keyframes particle2': {
            '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: 0.7 },
            '50%': { transform: 'translateY(-60px) scale(2)', opacity: 1 },
          }
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: '30%',
          left: '20%',
          width: 1.5,
          height: 1.5,
          background: 'rgba(118, 75, 162, 0.8)',
          borderRadius: '50%',
          animation: 'particle3 12s ease-in-out infinite',
          '@keyframes particle3': {
            '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: 0.8 },
            '50%': { transform: 'translateY(-40px) scale(1.8)', opacity: 1 },
          }
        }} />
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                color: theme.palette.mode === 'dark' ? '#f7fafc' : '#2d3748',
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
              }}
            >
              Números que Impressionam
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                textAlign: 'center',
                p: 3,
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: 1,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(15px)',
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 15px 45px rgba(0, 0, 0, 0.4)'
                    : '0 15px 45px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <AnimatedCounter end={500} suffix="+" />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Produtos Gerenciados
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                textAlign: 'center',
                p: 3,
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: 1,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(15px)',
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 15px 45px rgba(0, 0, 0, 0.4)'
                    : '0 15px 45px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <AnimatedCounter end={50} suffix="+" />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Vendedores Ativos
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                textAlign: 'center',
                p: 3,
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: 1,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(15px)',
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 15px 45px rgba(0, 0, 0, 0.4)'
                    : '0 15px 45px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <AnimatedCounter end={1000} suffix="+" />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Vendas Realizadas
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                textAlign: 'center',
                p: 3,
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: 1,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(15px)',
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 15px 45px rgba(0, 0, 0, 0.4)'
                    : '0 15px 45px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <AnimatedCounter end={99} suffix="%" />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Satisfação
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2, 
        py: { xs: 8, sm: 12, md: 16, lg: 20 },
        px: { xs: 2, sm: 3, md: 6, lg: 8, xl: 10 },
      }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                color: theme.palette.mode === 'dark' ? '#f7fafc' : '#2d3748',
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
              }}
            >
              O que Nossos Clientes Dizem
            </Typography>
          </Box>

          <Box sx={{ 
            maxWidth: 800, 
            mx: 'auto',
            position: 'relative',
          }}>
            <Fade in timeout={500} key={currentTestimonial}>
              <Card
                sx={{
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: 1,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                    : '0 4px 20px rgba(0, 0, 0, 0.1)',
                  p: { xs: 3, sm: 4, md: 5 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 15px 45px rgba(0, 0, 0, 0.4)'
                      : '0 15px 45px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#fbbf24', fontSize: 24 }} />
                    ))}
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                      mb: 4,
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                    }}
                  >
                    "{testimonials[currentTestimonial].text}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar
                      src={testimonials[currentTestimonial].avatar}
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mr: 2,
                        border: `3px solid ${theme.palette.mode === 'dark' ? '#667eea' : '#667eea'}`,
                      }}
                    />
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.mode === 'dark' ? '#f7fafc' : '#2d3748',
                        }}
                      >
                        {testimonials[currentTestimonial].name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.mode === 'dark' ? '#a0aec0' : '#718096',
                        }}
                      >
                        {testimonials[currentTestimonial].role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>

            {/* Testimonial Navigation */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              gap: 1,
            }}>
              {testimonials.map((_, index) => (
                <IconButton
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: index === currentTestimonial 
                      ? '#667eea' 
                      : theme.palette.mode === 'dark' ? '#4a5568' : '#e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: index === currentTestimonial ? '#667eea' : '#a0aec0',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2, 
        py: { xs: 8, sm: 12, md: 16, lg: 20 },
        px: { xs: 2, sm: 3, md: 6, lg: 8, xl: 10 },
        background: theme.palette.mode === 'dark' 
          ? 'rgba(26, 32, 44, 0.8)' 
          : 'rgba(237, 242, 247, 0.8)',
        backdropFilter: 'blur(20px)',
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                color: theme.palette.mode === 'dark' ? '#f7fafc' : '#2d3748',
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
              }}
            >
              Pronto para Revolucionar sua Loja?
            </Typography>
            
                         <Typography 
               variant="h5" 
               sx={{ 
                 color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                 mb: 6,
                 fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                 lineHeight: 1.6,
               }}
             >
               Junte-se a centenas de lojas que já transformaram seus negócios com nosso sistema
             </Typography>
            
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              startIcon={<PlayArrowIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                px: { xs: 6, sm: 8 },
                py: { xs: 2, sm: 2.5 },
                borderRadius: 1,
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                }
              }}
            >
              Começar Gratuitamente
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2, 
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 3, md: 6, lg: 8, xl: 10 },
        background: theme.palette.mode === 'dark' 
          ? 'rgba(26, 32, 44, 0.9)' 
          : 'rgba(237, 242, 247, 0.9)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.08)'}`,
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 3,
          }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box
                component="img"
                src="/Logo Vector.png"
                alt="LIS MODAS Logo"
                sx={{
                  height: 40,
                  width: 'auto',
                  mb: 2,
                  filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                  maxWidth: 300,
                }}
              >
                Sistema completo de gestão para lojas de roupas. 
                Simplifique sua operação e maximize seus resultados.
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                                            <Typography 
                 variant="body2" 
                 sx={{ 
                   color: theme.palette.mode === 'dark' ? '#a0aec0' : '#4a5568',
                 }}
               >
                 © 2024 LIS MODAS. Todos os direitos reservados.
               </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 
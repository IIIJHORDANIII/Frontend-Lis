import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  Security,
  DataUsage,
  Visibility,
  Lock,
  Shield,
  Info,
  CheckCircle,
  Warning
} from '@mui/icons-material';

const PrivacyPolicy: React.FC = () => {
  const theme = useTheme();
  
  const sections = [
    {
      title: "Coleta de Informações",
      icon: <DataUsage />,
      content: [
        "Coletamos informações pessoais como nome, email e dados de acesso quando você se registra em nossa plataforma.",
        "Informações de uso da plataforma, incluindo produtos visualizados e listas criadas.",
        "Dados técnicos como endereço IP, tipo de navegador e sistema operacional para melhorar a experiência."
      ]
    },
    {
      title: "Uso das Informações",
      icon: <Visibility />,
      content: [
        "Fornecer e manter nossos serviços de gestão de estoque.",
        "Processar transações e gerenciar vendas.",
        "Enviar comunicações importantes sobre sua conta e serviços.",
        "Melhorar nossos produtos e desenvolver novos recursos."
      ]
    },
    {
      title: "Proteção de Dados",
      icon: <Security />,
      content: [
        "Utilizamos criptografia SSL/TLS para proteger dados em trânsito.",
        "Armazenamento seguro em servidores com acesso restrito.",
        "Backups regulares e sistemas de recuperação de dados.",
        "Monitoramento contínuo para detectar e prevenir violações de segurança."
      ]
    },
    {
      title: "Compartilhamento de Dados",
      icon: <Lock />,
      content: [
        "Não vendemos, alugamos ou compartilhamos dados pessoais com terceiros para fins comerciais.",
        "Compartilhamento apenas com prestadores de serviços essenciais (hospedagem, pagamentos).",
        "Divulgação quando exigido por lei ou para proteger direitos e segurança.",
        "Compartilhamento de listas públicas apenas com consentimento explícito do usuário."
      ]
    },
    {
      title: "Seus Direitos",
      icon: <Shield />,
      content: [
        "Acesso aos seus dados pessoais armazenados em nossa plataforma.",
        "Correção de informações incorretas ou desatualizadas.",
        "Exclusão de sua conta e dados associados a qualquer momento.",
        "Portabilidade dos dados em formato estruturado e legível."
      ]
    },
    {
      title: "Cookies e Tecnologias",
      icon: <Info />,
      content: [
        "Utilizamos cookies essenciais para funcionamento da plataforma.",
        "Cookies de análise para melhorar a experiência do usuário.",
        "Você pode gerenciar preferências de cookies através do navegador.",
        "Não utilizamos cookies de rastreamento de terceiros."
      ]
    }
  ];

  const contactInfo = {
    email: "contato@lismodas.com",
    phone: "+55 (46) 99901-9800",
    address: "João Roque dos Santos, 203"
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      position: 'relative',
      fontFamily: 'Poppins, Inter, Montserrat, Arial',
      background: theme.customColors.background.gradient,
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 6 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ 
              mb: 6,
              p: 4,
              background: `linear-gradient(135deg, ${theme.customColors.primary.main} 0%, ${theme.customColors.primary.light} 100%)`,
              borderRadius: 4,
              color: theme.customColors.text.inverse,
              textAlign: 'center',
              boxShadow: theme.customColors.shadow.primary,
            }}>
              <Typography variant="h3" component="h1" sx={{ 
                fontWeight: 800, 
                mb: 2,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
              }}>
                Política de Privacidade
              </Typography>
              <Typography variant="h6" sx={{ 
                opacity: 0.9,
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              }}>
                Protegemos seus dados com transparência e responsabilidade
              </Typography>
              <Chip
                icon={<CheckCircle />}
                label="Última atualização: Janeiro 2024"
                sx={{
                  mt: 3,
                  backgroundColor: alpha(theme.customColors.text.inverse, 0.2),
                  color: theme.customColors.text.inverse,
                  fontWeight: 600,
                  border: `1px solid ${alpha(theme.customColors.text.inverse, 0.3)}`,
                }}
              />
            </Box>

            {/* Introduction */}
            <Card sx={{
              mb: 6,
              background: theme.customColors.surface.card,
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: `1px solid ${theme.customColors.border.primary}`,
              boxShadow: theme.customColors.shadow.secondary,
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ 
                  color: theme.customColors.text.primary, 
                  fontWeight: 700, 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                }}>
                  <Security sx={{ color: theme.customColors.text.secondary }} />
                  Nossa Compromisso com a Privacidade
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: theme.customColors.text.secondary, 
                  lineHeight: 1.8,
                  mb: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                }}>
                  Sua privacidade é fundamental para nós. Esta política descreve como coletamos, 
                  usamos e protegemos suas informações pessoais quando você utiliza nossa 
                  plataforma de gestão de estoque.
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: theme.customColors.text.secondary, 
                  lineHeight: 1.8,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                }}>
                  Ao usar nossos serviços, você concorda com a coleta e uso de informações 
                  de acordo com esta política. Seus dados são tratados com total transparência 
                  e segurança.
                </Typography>
              </CardContent>
            </Card>

            {/* Sections */}
            <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
              {sections.map((section, index) => (
                <Fade in timeout={800 + index * 100} key={section.title}>
                  <Card sx={{
                    background: theme.customColors.surface.card,
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: `1px solid ${theme.customColors.border.primary}`,
                    boxShadow: theme.customColors.shadow.secondary,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.customColors.shadow.primary,
                    },
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ 
                        color: theme.customColors.text.primary, 
                        fontWeight: 700, 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                      }}>
                        {React.cloneElement(section.icon, { 
                          sx: { color: theme.customColors.primary.main } 
                        })}
                        {section.title}
                      </Typography>
                      <List dense>
                        {section.content.map((item, itemIndex) => (
                          <ListItem key={itemIndex} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle sx={{ 
                                fontSize: 16, 
                                color: theme.customColors.status.success 
                              }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={item}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  color: theme.customColors.text.secondary,
                                  fontSize: { xs: '0.875rem', sm: '1rem' },
                                  lineHeight: 1.6,
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </Box>

            {/* Contact Information */}
            <Fade in timeout={1200}>
              <Card sx={{
                mt: 6,
                background: theme.customColors.surface.card,
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${theme.customColors.border.primary}`,
                boxShadow: theme.customColors.shadow.secondary,
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ 
                    color: theme.customColors.text.primary, 
                    fontWeight: 700, 
                    mb: 3,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  }}>
                    Entre em Contato
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: theme.customColors.text.secondary, 
                    mb: 4,
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                  }}>
                    Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
                    <Chip
                      label={`Email: ${contactInfo.email}`}
                      sx={{
                        backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                        color: theme.customColors.primary.main,
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={`Telefone: ${contactInfo.phone}`}
                      sx={{
                        backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                        color: theme.customColors.primary.main,
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={`Endereço: ${contactInfo.address}`}
                      sx={{
                        backgroundColor: alpha(theme.customColors.primary.main, 0.1),
                        color: theme.customColors.primary.main,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Fade>

            {/* Footer Note */}
            <Fade in timeout={1400}>
              <Box sx={{ 
                mt: 4, 
                p: 3, 
                textAlign: 'center',
                background: alpha(theme.customColors.text.primary, 0.02),
                borderRadius: 3,
                border: `1px solid ${theme.customColors.border.primary}`,
              }}>
                <Typography variant="body2" sx={{ 
                  color: theme.customColors.text.secondary,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}>
                  Esta política de privacidade pode ser atualizada periodicamente. 
                  Recomendamos que você revise regularmente para se manter informado sobre como protegemos suas informações.
                </Typography>
              </Box>
            </Fade>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy; 
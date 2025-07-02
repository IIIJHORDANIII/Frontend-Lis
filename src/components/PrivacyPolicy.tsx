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
  Fade
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
    }}>
      {/* Subtle Gradient Background */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 50%, #e2e8f0 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 12s ease-in-out infinite',
        '@keyframes gradientMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 6 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ 
              mb: 6,
              p: 4,
              background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
              borderRadius: 4,
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(45, 55, 72, 0.15)',
            }}>
              <Typography variant="h3" component="h1" sx={{ 
                fontWeight: 800, 
                mb: 2,
                letterSpacing: '-0.02em',
              }}>
                Política de Privacidade
              </Typography>
              <Typography variant="h6" sx={{ 
                opacity: 0.9,
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto'
              }}>
                Protegemos seus dados com transparência e responsabilidade
              </Typography>
              <Chip
                icon={<CheckCircle />}
                label="Última atualização: Janeiro 2024"
                sx={{
                  mt: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            </Box>

            {/* Introduction */}
            <Card sx={{
              mb: 6,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ 
                  color: '#2d3748', 
                  fontWeight: 700, 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Security sx={{ color: '#4a5568' }} />
                  Nossa Compromisso com a Privacidade
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#718096', 
                  lineHeight: 1.8,
                  mb: 3
                }}>
                  Sua privacidade é fundamental para nós. Esta política descreve como coletamos, 
                  usamos e protegemos suas informações pessoais quando você utiliza nossa 
                  plataforma de gestão de estoque.
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#718096', 
                  lineHeight: 1.8
                }}>
                  Ao usar nossos serviços, você concorda com a coleta e uso de informações 
                  de acordo com esta política. Seus dados são tratados com total transparência 
                  e segurança.
                </Typography>
              </CardContent>
            </Card>

            {/* Sections */}
            <Box sx={{ mb: 6 }}>
              {sections.map((section, index) => (
                <Fade in timeout={800 + index * 200} key={section.title}>
                  <Card sx={{
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ 
                        color: '#2d3748', 
                        fontWeight: 700, 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        {section.icon}
                        {section.title}
                      </Typography>
                      <List sx={{ py: 0 }}>
                        {section.content.map((item, itemIndex) => (
                          <ListItem key={itemIndex} sx={{ px: 0, py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <CheckCircle sx={{ color: '#2d3748', fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={item}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  color: '#718096',
                                  lineHeight: 1.6,
                                  fontSize: '0.95rem'
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
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ 
                  color: '#2d3748', 
                  fontWeight: 700, 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Info sx={{ color: '#4a5568' }} />
                  Entre em Contato
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#718096', 
                  mb: 3,
                  lineHeight: 1.6
                }}>
                  Se você tiver dúvidas sobre esta política de privacidade ou sobre como 
                  tratamos seus dados, entre em contato conosco:
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: 3
                }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600, mb: 1 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      {contactInfo.email}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600, mb: 1 }}>
                      Telefone
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      {contactInfo.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600, mb: 1 }}>
                      Endereço
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      {contactInfo.address}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <Paper sx={{
              mt: 4,
              p: 3,
              background: 'rgba(45, 55, 72, 0.05)',
              borderRadius: 3,
              border: '1px solid rgba(45, 55, 72, 0.1)',
              textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ color: '#718096' }}>
                Esta política de privacidade pode ser atualizada periodicamente. 
                Recomendamos que você revise esta página regularmente para se manter 
                informado sobre como protegemos suas informações.
              </Typography>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy; 
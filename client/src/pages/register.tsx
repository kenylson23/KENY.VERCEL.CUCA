import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, useLocation } from 'wouter';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    setLocation('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Nome de usuário é obrigatório');
      return;
    }

    if (username.length < 3) {
      setError('Nome de usuário deve ter pelo menos 3 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const result = await register.mutateAsync({ 
        username,
        email, 
        password, 
        firstName, 
        lastName 
      });
      
      setSuccess(result.message || 'Conta criada com sucesso! Verifique seu email para confirmar.');
      
      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            <UserPlus className="mx-auto h-6 w-6 mb-2" />
            Criar Conta
          </CardTitle>
          <CardDescription className="text-center">
            Crie sua conta para acessar recursos exclusivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Escolha um nome de usuário"
                required
                minLength={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={register.isPending}
            >
              {register.isPending ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Fazer login
            </Link>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Voltar para o site
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
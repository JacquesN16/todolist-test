import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ accessToken: string }> {
    const { firstName, lastName, email, password, confirmPassword } = signupDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    await this.usersRepository.save(user);

    const accessToken = this.jwtService.sign({ id: user.id, email: user.email });
    return { accessToken };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ id: user.id, email: user.email });
    return { accessToken };
  }
}
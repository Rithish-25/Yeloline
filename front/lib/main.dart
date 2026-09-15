import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/splash/splash_screen.dart';

void main() {
  runApp(const YeloLineApp());
}

class YeloLineApp extends StatelessWidget {
  const YeloLineApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Yeloline',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const SplashScreen(),
    );
  }
}

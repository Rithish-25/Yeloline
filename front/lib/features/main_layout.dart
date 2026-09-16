import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../core/constants/app_colors.dart';
import '../models/project_model.dart';
import '../widgets/common/custom_bottom_nav.dart';
import '../widgets/common/custom_header.dart';
import 'about/about_screen.dart';
import 'contact/contact_screen.dart';
import 'home/home_screen.dart';
import 'projects/project_details_screen.dart';
import 'projects/projects_screen.dart';
import 'quote/get_quote_screen.dart';
import 'renovation/renovation_screen.dart';

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;
  Project? _selectedProject;
  bool _showingAboutScreen = false;

  void _navigateToTab(int index) {
    setState(() {
      _currentIndex = index;
      _selectedProject = null;
      _showingAboutScreen = false;
    });
  }

  void _showProjectDetails(Project project) {
    setState(() {
      _selectedProject = project;
    });
  }

  void _showAboutUs() {
    setState(() {
      _showingAboutScreen = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Bottom navigation bar is ONLY visible on the Home page
    final bool isHomePage = _currentIndex == 0 && !_showingAboutScreen && _selectedProject == null;

    String? headerTitle;
    bool showHeaderBack = !isHomePage;

    if (_showingAboutScreen) {
      headerTitle = 'About Us';
    } else {
      switch (_currentIndex) {
        case 1:
          headerTitle = 'Our Projects';
          break;
        case 2:
          headerTitle = 'Get Construction Quote';
          break;
        case 3:
          headerTitle = 'Renovation Van';
          break;
        case 4:
          headerTitle = 'Contact Us';
          break;
        default:
          headerTitle = null; // Shows logo.png brand header on Home
      }
    }

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.dark,
        systemNavigationBarColor: AppColors.darkCharcoal,
        systemNavigationBarIconBrightness: Brightness.light,
      ),
      child: PopScope(
        canPop: isHomePage,
        onPopInvokedWithResult: (didPop, result) {
          if (didPop) return;
          if (_selectedProject != null) {
            setState(() => _selectedProject = null);
          } else if (_showingAboutScreen || _currentIndex != 0) {
            _navigateToTab(0);
          }
        },
        child: _selectedProject != null
            ? ProjectDetailsScreen(
                project: _selectedProject!,
                onBack: () => setState(() => _selectedProject = null),
                onGetQuote: () => _navigateToTab(2),
                onContact: () => _navigateToTab(4),
              )
            : Scaffold(
                appBar: CustomHeader(
                  title: headerTitle,
                  showBackButton: showHeaderBack,
                  onBackTap: () => _navigateToTab(0),
                ),
                body: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 250),
                  child: _buildBody(),
                ),
                bottomNavigationBar: isHomePage
                    ? CustomBottomNav(
                        currentIndex: _currentIndex,
                        onTap: (index) {
                          _navigateToTab(index);
                        },
                      )
                    : null,
              ),
      ),
    );
  }

  Widget _buildBody() {
    if (_showingAboutScreen) {
      return AboutScreen(onContactTap: () => _navigateToTab(4));
    }

    switch (_currentIndex) {
      case 0:
        return HomeScreen(
          onNavigateTab: (idx) {
            if (idx == 0) {
              _showAboutUs();
            } else {
              _navigateToTab(idx);
            }
          },
        );
      case 1:
        return ProjectsScreen(
          onSelectProject: _showProjectDetails,
        );
      case 2:
        return GetQuoteScreen(
          onGoHome: () => _navigateToTab(0),
          onGoProjects: () => _navigateToTab(1),
        );
      case 3:
        return const RenovationScreen();
      case 4:
        return const ContactScreen();
      default:
        return HomeScreen(onNavigateTab: _navigateToTab);
    }
  }
}

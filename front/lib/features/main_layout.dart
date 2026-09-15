import 'package:flutter/material.dart';
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
    // If a project is selected, display project details screen overlay
    if (_selectedProject != null) {
      return ProjectDetailsScreen(
        project: _selectedProject!,
        onBack: () => setState(() => _selectedProject = null),
        onGetQuote: () => _navigateToTab(2),
        onContact: () => _navigateToTab(4),
      );
    }

    String? headerTitle;
    bool showHeaderBack = false;

    if (_showingAboutScreen) {
      headerTitle = 'About Us';
      showHeaderBack = true;
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
          headerTitle = null; // Shows logo.png brand header
      }
    }

    return Scaffold(
      appBar: CustomHeader(
        title: headerTitle,
        showBackButton: showHeaderBack,
        onBackTap: () => setState(() => _showingAboutScreen = false),
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 250),
        child: _buildBody(),
      ),
      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) {
          if (index == 0 && _currentIndex == 0 && !_showingAboutScreen) {
            // Already home
          } else if (index == 0 && _showingAboutScreen) {
            // If clicking Home while in About Us, open About Us or Home
            _navigateToTab(0);
          } else {
            _navigateToTab(index);
          }
        },
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

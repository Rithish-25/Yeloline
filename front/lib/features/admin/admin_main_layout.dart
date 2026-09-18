import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/utils/auth_service.dart';
import 'dashboard/admin_dashboard_screen.dart';
import 'expense/admin_expense_screen.dart';
import 'login/admin_login_screen.dart';
import 'payment/admin_payment_screen.dart';
import 'purchase/admin_purchase_screen.dart';
import 'sites/admin_sites_screen.dart';

class AdminMainLayout extends StatefulWidget {
  final int initialTab;

  const AdminMainLayout({
    super.key,
    this.initialTab = 0,
  });

  @override
  State<AdminMainLayout> createState() => _AdminMainLayoutState();
}

class _AdminMainLayoutState extends State<AdminMainLayout> {
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialTab;
  }

  void _onTabSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  Widget _buildBody() {
    switch (_currentIndex) {
      case 0:
        return AdminDashboardScreen(onNavigateTab: _onTabSelected);
      case 1:
        return const AdminSitesScreen();
      case 2:
        return const AdminExpenseScreen();
      case 3:
        return const AdminPurchaseScreen();
      case 4:
        return const AdminPaymentScreen();
      default:
        return AdminDashboardScreen(onNavigateTab: _onTabSelected);
    }
  }

  String _getTabTitle(int index) {
    switch (index) {
      case 1:
        return 'Site Financials';
      case 2:
        return 'Expenses';
      case 3:
        return 'Purchase Orders';
      case 4:
        return 'Payments';
      default:
        return '';
    }
  }

  Widget _buildCircularBackButton() {
    return IconButton(
      onPressed: () => setState(() => _currentIndex = 0),
      icon: const Icon(
        Icons.arrow_back_ios_new_rounded,
        color: Colors.white,
        size: 20,
      ),
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(),
    );
  }

  Widget? _buildBottomNavBar() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.darkCharcoal,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: 12,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: Container(
          height: 64,
          padding: const EdgeInsets.symmetric(horizontal: 6),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, Icons.dashboard_rounded, 'Dashboard'),
              _buildNavItem(1, Icons.business_rounded, 'Sites'),
              _buildNavItem(2, Icons.receipt_long_rounded, 'Expense'),
              _buildNavItem(3, Icons.shopping_cart_rounded, 'Purchase'),
              _buildNavItem(4, Icons.payments_rounded, 'Payment'),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: _currentIndex == 0,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop && _currentIndex != 0) {
          setState(() {
            _currentIndex = 0;
          });
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          backgroundColor: AppColors.darkCharcoal,
          scrolledUnderElevation: 0.0,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          automaticallyImplyLeading: false,
          titleSpacing: 16,
          title: _currentIndex == 0
              ? Row(
                  children: [
                    Image.asset(
                      'assets/logo.png',
                      height: 34,
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stackTrace) {
                        return const Text(
                          'YELOLINE',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: 1.2,
                          ),
                        );
                      },
                    ),
                  ],
                )
              : Row(
                  children: [
                    _buildCircularBackButton(),
                    const SizedBox(width: 12),
                    Text(
                      _getTabTitle(_currentIndex),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.3,
                      ),
                    ),
                  ],
                ),
          actions: [
            if (_currentIndex == 0) ...[
              IconButton(
                tooltip: 'Logout Admin',
                icon: const Icon(Icons.logout_rounded, color: Colors.white70, size: 20),
                onPressed: () async {
                  final confirm = await showDialog<bool>(
                    context: context,
                    barrierDismissible: false,
                    builder: (context) => PopScope(
                      canPop: false,
                      child: AlertDialog(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        backgroundColor: Colors.white,
                        title: const Row(
                          children: [
                            Icon(Icons.logout_rounded, color: AppColors.darkYellow, size: 24),
                            SizedBox(width: 10),
                            Text(
                              'Confirm Logout',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                            ),
                          ],
                        ),
                        content: const Text(
                          'Are you sure you want to log out?',
                          style: TextStyle(fontSize: 14, color: AppColors.textSecondary, fontWeight: FontWeight.w400),
                        ),
                        actionsPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        actions: [
                          OutlinedButton(
                            onPressed: () => Navigator.of(context).pop(false),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.textPrimary,
                              side: const BorderSide(color: AppColors.borderLight, width: 1.5),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                            ),
                            child: const Text('No', style: TextStyle(fontWeight: FontWeight.w500)),
                          ),
                          ElevatedButton(
                            onPressed: () => Navigator.of(context).pop(true),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primaryYellow,
                              foregroundColor: AppColors.darkCharcoal,
                              elevation: 2,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
                            ),
                            child: const Text('Yes', style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    ),
                  );

                  if (confirm == true) {
                    if (!context.mounted) return;
                    final nav = Navigator.of(context);
                    await AuthService.logoutAdmin();
                    nav.pushReplacement(
                      MaterialPageRoute(builder: (context) => const AdminLoginScreen()),
                    );
                  }
                },
              ),
              const SizedBox(width: 8),
            ],
          ],
        ),
        body: _buildBody(),
        bottomNavigationBar: _buildBottomNavBar(),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    return Expanded(
      child: InkWell(
        onTap: () => _onTabSelected(index),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primaryYellow.withValues(alpha: 0.2)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: isSelected ? AppColors.primaryYellow : Colors.white60,
                  size: 22,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                  color: isSelected ? AppColors.primaryYellow : Colors.white60,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

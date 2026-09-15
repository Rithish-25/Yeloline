import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class CustomBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const CustomBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Container(
          height: 68,
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                index: 0,
                icon: Icons.home_rounded,
                activeIcon: Icons.home_rounded,
                label: 'Home',
              ),
              _buildNavItem(
                index: 1,
                icon: Icons.apartment_outlined,
                activeIcon: Icons.apartment_rounded,
                label: 'Projects',
              ),
              // Center Featured "Get Quote" Button
              _buildCenterQuoteButton(),
              _buildNavItem(
                index: 3,
                icon: Icons.local_shipping_outlined,
                activeIcon: Icons.local_shipping_rounded,
                label: 'Renovation',
              ),
              _buildNavItem(
                index: 4,
                icon: Icons.phone_in_talk_outlined,
                activeIcon: Icons.phone_in_talk_rounded,
                label: 'Contact',
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required IconData activeIcon,
    required String label,
  }) {
    final isSelected = currentIndex == index;

    return Expanded(
      child: InkWell(
        onTap: () => onTap(index),
        splashColor: AppColors.primaryYellow.withValues(alpha: 0.2),
        highlightColor: Colors.transparent,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 42,
              height: 42,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                gradient: isSelected ? AppColors.yellowGradient : null,
                color: isSelected ? null : Colors.transparent,
                shape: BoxShape.circle,
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: AppColors.primaryYellow.withValues(alpha: 0.35),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ]
                    : null,
              ),
              child: Icon(
                isSelected ? activeIcon : icon,
                color: isSelected ? AppColors.darkCharcoal : AppColors.textMuted,
                size: 22,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                color: isSelected ? AppColors.darkCharcoal : AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCenterQuoteButton() {
    final isSelected = currentIndex == 2;

    return Expanded(
      child: InkWell(
        onTap: () => onTap(2),
        splashColor: AppColors.primaryYellow.withValues(alpha: 0.1),
        highlightColor: Colors.transparent,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                gradient: isSelected ? AppColors.yellowGradient : null,
                color: isSelected ? null : Colors.transparent,
                shape: BoxShape.circle,
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: AppColors.primaryYellow.withValues(alpha: 0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ]
                    : null,
              ),
              child: Icon(
                isSelected ? Icons.assignment_rounded : Icons.assignment_outlined,
                color: isSelected ? AppColors.darkCharcoal : AppColors.textMuted,
                size: 22,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'Get Quote',
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? AppColors.darkCharcoal : AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

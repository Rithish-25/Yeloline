import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class AdminDashboardScreen extends StatelessWidget {
  final Function(int index) onNavigateTab;

  const AdminDashboardScreen({
    super.key,
    required this.onNavigateTab,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Welcome Greeting
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Financial Overview',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey.shade600,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    'Company Dashboard',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                      letterSpacing: -0.5,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.primaryYellow.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.primaryYellow),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.check_circle_rounded, color: AppColors.darkCharcoal, size: 14),
                    SizedBox(width: 4),
                    Text(
                      'Live Sites (3)',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.darkCharcoal,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Top 4 Financial KPI Summary Grid
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: [
              _buildKpiCard(
                title: 'Total Project Value',
                amount: '₹4,30,000',
                subtitle: 'Across 3 Sites',
                icon: Icons.account_balance_wallet_rounded,
                color: AppColors.darkCharcoal,
                bgColor: AppColors.lightYellowBg,
              ),
              _buildKpiCard(
                title: 'Total Received',
                amount: '₹2,15,000',
                subtitle: 'Client Collections',
                icon: Icons.savings_rounded,
                color: Colors.green.shade800,
                bgColor: Colors.green.shade50,
              ),
              _buildKpiCard(
                title: 'Total Spent',
                amount: '₹1,42,500',
                subtitle: 'Labour & Materials',
                icon: Icons.payments_rounded,
                color: Colors.orange.shade800,
                bgColor: Colors.orange.shade50,
              ),
              _buildKpiCard(
                title: 'Remaining Receivable',
                amount: '₹1,70,000',
                subtitle: 'Pending Collection',
                icon: Icons.pending_actions_rounded,
                color: Colors.blue.shade800,
                bgColor: Colors.blue.shade50,
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Quick Actions Grid
          const Text(
            'Quick Operations',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: _buildActionButton(
                  context,
                  title: 'Expense',
                  icon: Icons.receipt_long_rounded,
                  color: AppColors.darkCharcoal,
                  onTap: () => onNavigateTab(2),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildActionButton(
                  context,
                  title: 'Purchase',
                  icon: Icons.shopping_cart_rounded,
                  color: AppColors.darkCharcoal,
                  onTap: () => onNavigateTab(3),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildActionButton(
                  context,
                  title: 'Payment',
                  icon: Icons.payments_rounded,
                  color: AppColors.darkCharcoal,
                  onTap: () => onNavigateTab(4),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Recent Activity Log
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Recent Entries',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              TextButton(
                onPressed: () => onNavigateTab(1),
                child: const Text(
                  'View Sites',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.darkYellow),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          _buildRecentEntryItem(
            type: 'Payment Received',
            site: 'Skyline Residency',
            detail: 'Rahul Patel (Part payment)',
            amount: '+ ₹2,00,000',
            date: '15 May 2024',
            isIncome: true,
          ),
          _buildRecentEntryItem(
            type: 'Material Purchase',
            site: 'Skyline Residency',
            detail: 'Shree Ganesh Bricks (Red Bricks)',
            amount: '- ₹1,20,000',
            date: '15 May 2024',
            isIncome: false,
          ),
          _buildRecentEntryItem(
            type: 'Labour Expense',
            site: 'Thindal Residence',
            detail: 'Masonry Labour Block A',
            amount: '- ₹25,000',
            date: '14 May 2024',
            isIncome: false,
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildKpiCard({
    required String title,
    required String amount,
    required String subtitle,
    required IconData icon,
    required Color color,
    required Color bgColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600, // Title: Semi Bold
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 4),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, size: 16, color: color),
              ),
            ],
          ),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              amount,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w400, // Amount: Regular Text
                color: color,
                letterSpacing: -0.5,
              ),
            ),
          ),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w400,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.cardWhite,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.primaryYellow.withValues(alpha: 0.4)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: AppColors.primaryYellow,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppColors.darkCharcoal, size: 18),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentEntryItem({
    required String type,
    required String site,
    required String detail,
    required String amount,
    required String date,
    required bool isIncome,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isIncome ? Colors.green.shade50 : Colors.red.shade50,
              shape: BoxShape.circle,
            ),
            child: Icon(
              isIncome ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
              color: isIncome ? Colors.green.shade800 : Colors.red.shade800,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  type,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                ),
                Text(
                  '$site • $detail',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w400, color: AppColors.textSecondary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                amount,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: isIncome ? Colors.green.shade800 : Colors.red.shade800,
                ),
              ),
              Text(
                date,
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w400, color: AppColors.textSecondary),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

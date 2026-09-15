import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/utils/url_helper.dart';
import '../../widgets/cards/quick_action_card.dart';
import '../../widgets/cards/stat_card.dart';

class HomeScreen extends StatelessWidget {
  final Function(int index) onNavigateTab;

  const HomeScreen({
    super.key,
    required this.onNavigateTab,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Modern Hero Banner Section
          _buildHeroSection(context),

          const SizedBox(height: 14),

          // Core Services & Navigation Section
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 4,
                      height: 20,
                      decoration: BoxDecoration(
                        color: AppColors.primaryYellow,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Explore Services & Details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                        letterSpacing: -0.3,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildQuickNavigationGrid(context),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Featured Villa Projects Preview Section
          _buildFeaturedProjectsSection(context),

          const SizedBox(height: 28),

          // Company Statistics Dark Banner
          _buildCompanyStatsBanner(),

          const SizedBox(height: 28),

          // Call to Action Banner
          _buildQuoteCTABanner(context),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildHeroSection(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // Hero Villa Image Background with Dark Overlay Gradient
          Container(
            height: 220,
            width: double.infinity,
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
                ),
                fit: BoxFit.cover,
              ),
            ),
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.darkCharcoal.withValues(alpha: 0.92),
                    AppColors.darkCharcoal.withValues(alpha: 0.65),
                    AppColors.darkCharcoal.withValues(alpha: 0.95),
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
          ),

          // Hero Content Text
          Positioned.fill(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Top Tag Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      gradient: AppColors.yellowGradient,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primaryYellow.withValues(alpha: 0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const Text(
                      'YELOLINE CONSTRUCTION',
                      style: TextStyle(
                        color: AppColors.darkCharcoal,
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(
                          text: 'Building trust.\n',
                          style: TextStyle(
                            fontSize: 27,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            height: 1.15,
                            letterSpacing: -0.5,
                          ),
                        ),
                        TextSpan(
                          text: 'Delivering quality homes.',
                          style: TextStyle(
                            fontSize: 27,
                            fontWeight: FontWeight.w900,
                            color: AppColors.primaryYellow,
                            height: 1.15,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'From dream to key, we build with integrity and precision.',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      _buildHeroBadge('⭐ 4.9 Rating'),
                      const SizedBox(width: 8),
                      _buildHeroBadge('150+ Projects'),
                      const SizedBox(width: 8),
                      _buildHeroBadge('Erode, TN'),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroBadge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildQuickNavigationGrid(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.15,
      children: [
        QuickActionCard(
          icon: Icons.info_outline_rounded,
          title: 'About Us',
          subtitle: 'Know more about Yeloline Construction',
          onTap: () => onNavigateTab(0), // Navigate / detail
        ),
        QuickActionCard(
          icon: Icons.apartment_rounded,
          title: 'Our Projects',
          subtitle: 'Explore our completed residential projects',
          onTap: () => onNavigateTab(1),
        ),
        QuickActionCard(
          icon: Icons.request_quote_rounded,
          title: 'Get Quote',
          subtitle: 'Get a detailed estimate for your dream home',
          onTap: () => onNavigateTab(2),
        ),
        QuickActionCard(
          icon: Icons.local_shipping_rounded,
          title: 'Renovation Van',
          subtitle: 'Book our service van for site visits & more',
          onTap: () => onNavigateTab(3),
        ),
        QuickActionCard(
          icon: Icons.phone_callback_rounded,
          title: 'Call Us',
          subtitle: 'Speak to our experts for guidance',
          onTap: () => _showContactModal(context, 'Call', '+91 98765 43210'),
        ),
        QuickActionCard(
          icon: Icons.chat_bubble_outline_rounded,
          title: 'WhatsApp',
          subtitle: 'Chat with us on WhatsApp',
          onTap: () => _showContactModal(context, 'WhatsApp', '+91 98765 43210'),
        ),
      ],
    );
  }

  Widget _buildCompanyStatsBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardDark,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white10),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.verified_rounded, color: AppColors.primaryYellow, size: 20),
              const SizedBox(width: 8),
              Text(
                'WHY YELOLINE?',
                style: const TextStyle(
                  color: AppColors.primaryYellow,
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.0,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: const [
              Expanded(
                child: StatCard(
                  icon: Icons.calendar_today_rounded,
                  title: '2017',
                  subtitle: 'Founded',
                  description: 'Building trust since 2017',
                  isDark: true,
                ),
              ),
              SizedBox(width: 10),
              Expanded(
                child: StatCard(
                  icon: Icons.military_tech_rounded,
                  title: '30+',
                  subtitle: 'Projects',
                  description: 'Successfully completed homes',
                  isDark: true,
                ),
              ),
              SizedBox(width: 10),
              Expanded(
                child: StatCard(
                  icon: Icons.location_on_rounded,
                  title: 'Erode',
                  subtitle: 'Based',
                  description: 'Proudly serving Erode & nearby',
                  isDark: true,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuoteCTABanner(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.yellowGradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryYellow.withOpacity(0.35),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Planning your Dream Home?',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: AppColors.darkCharcoal,
                    letterSpacing: -0.3,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Get an instant material & rate estimate in 3 simple steps.',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.darkCharcoal,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          ElevatedButton(
            onPressed: () => onNavigateTab(2),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.darkCharcoal,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Get Quote',
                  style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                ),
                SizedBox(width: 4),
                Icon(Icons.arrow_forward_rounded, size: 16, color: AppColors.primaryYellow),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showContactModal(BuildContext context, String type, String number) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.borderLight,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              Icon(
                type == 'Call' ? Icons.phone_in_talk_rounded : Icons.chat_rounded,
                size: 48,
                color: AppColors.primaryYellow,
              ),
              const SizedBox(height: 12),
              Text(
                'Connect via $type',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Our construction experts are ready to assist you.',
                style: const TextStyle(color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  number,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    if (type == 'Call') {
                      UrlHelper.makePhoneCall(number);
                    } else {
                      UrlHelper.openWhatsApp(number);
                    }
                  },
                  child: Text('Start $type Now'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFeaturedProjectsSection(BuildContext context) {
    final featuredProjects = [
      {
        'title': 'Skyline Residency',
        'location': 'Erode, Tamil Nadu',
        'year': 'Completed in 2023',
        'image': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      },
      {
        'title': 'Emerald Villa',
        'location': 'Salem, Tamil Nadu',
        'year': 'Completed in 2024',
        'image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
      },
      {
        'title': 'Golden Heights',
        'location': 'Coimbatore, Tamil Nadu',
        'year': 'Completed in 2023',
        'image': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 4,
                    height: 20,
                    decoration: BoxDecoration(
                      color: AppColors.primaryYellow,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'Featured Villa Projects',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                      letterSpacing: -0.3,
                    ),
                  ),
                ],
              ),
              InkWell(
                onTap: () => onNavigateTab(1),
                child: const Row(
                  children: [
                    Text(
                      'View All ',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppColors.darkYellow,
                      ),
                    ),
                    Icon(Icons.arrow_forward_rounded, size: 14, color: AppColors.darkYellow),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        SizedBox(
          height: 170,
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: featuredProjects.length,
            itemBuilder: (context, index) {
              final project = featuredProjects[index];
              return Container(
                width: 250,
                margin: const EdgeInsets.only(right: 14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                clipBehavior: Clip.antiAlias,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.network(
                      project['image']!,
                      fit: BoxFit.cover,
                    ),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.85),
                          ],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                    ),
                    Positioned(
                      left: 12,
                      right: 12,
                      bottom: 12,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.primaryYellow,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Text(
                              'Completed',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                                color: AppColors.darkCharcoal,
                              ),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            project['title']!,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: -0.3,
                            ),
                          ),
                          Row(
                            children: [
                              const Icon(Icons.location_on_rounded, color: AppColors.primaryYellow, size: 13),
                              const SizedBox(width: 4),
                              Text(
                                project['location']!,
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white70,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

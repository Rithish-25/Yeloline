import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_assets.dart';
import '../../core/constants/app_colors.dart';

class CustomHeader extends StatefulWidget implements PreferredSizeWidget {
  final String? title;
  final bool showBackButton;
  final VoidCallback? onBackTap;
  final VoidCallback? onNotificationTap;
  final bool hasNotification;

  const CustomHeader({
    super.key,
    this.title,
    this.showBackButton = false,
    this.onBackTap,
    this.onNotificationTap,
    this.hasNotification = true,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight + 8);

  @override
  State<CustomHeader> createState() => _CustomHeaderState();
}

class _CustomHeaderState extends State<CustomHeader> {
  late bool _hasUnreadNotification;

  @override
  void initState() {
    super.initState();
    _hasUnreadNotification = widget.hasNotification;
  }

  void _showNotificationModal(BuildContext context) {
    setState(() {
      _hasUnreadNotification = false;
    });

    if (widget.onNotificationTap != null) {
      widget.onNotificationTap!();
      return;
    }

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.cardWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.notifications_rounded, color: AppColors.darkYellow, size: 22),
                      SizedBox(width: 8),
                      Text(
                        'Notifications',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              _buildNotificationTile(
                title: 'Welcome to YeloLine Construction!',
                subtitle: 'Explore 3-step quotes & book site visit vans.',
                time: 'Just now',
              ),
              const SizedBox(height: 8),
              _buildNotificationTile(
                title: 'Free 3D Elevation Offer',
                subtitle: 'Get a complimentary 3D elevation design with villa bookings this month.',
                time: '2 hours ago',
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNotificationTile({required String title, required String subtitle, required String time}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.inputBackground,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: const BoxDecoration(
              color: AppColors.lightYellowBg,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.star_rounded, color: AppColors.primaryYellow, size: 16),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.textPrimary)),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ),
          Text(time, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.dark,
      ),
      child: Container(
        color: AppColors.darkCharcoal,
        child: SafeArea(
          bottom: false,
          child: Container(
            height: kToolbarHeight + 8,
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            decoration: const BoxDecoration(
              color: AppColors.darkCharcoal,
              border: Border(
                bottom: BorderSide(
                  color: Color(0xFF1E293B),
                  width: 1,
                ),
              ),
            ),
            child: Row(
              children: [
                if (widget.showBackButton) ...[
                  Padding(
                    padding: const EdgeInsets.only(right: 10.0),
                    child: Material(
                      color: const Color(0xFF1E293B),
                      shape: CircleBorder(
                        side: BorderSide(
                          color: Colors.white.withValues(alpha: 0.25),
                          width: 1.2,
                        ),
                      ),
                      clipBehavior: Clip.antiAlias,
                      elevation: 3,
                      shadowColor: Colors.black38,
                      child: InkWell(
                        onTap: widget.onBackTap ?? () => Navigator.maybePop(context),
                        child: const SizedBox(
                          width: 38,
                          height: 38,
                          child: Center(
                            child: Padding(
                              padding: EdgeInsets.only(left: 5.0),
                              child: Icon(
                                Icons.arrow_back_ios_rounded,
                                color: Colors.white,
                                size: 16,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
                if (widget.title != null && widget.title!.isNotEmpty) ...[
                  Text(
                    widget.title!,
                    style: GoogleFonts.urbanist(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.3,
                    ),
                  ),
                ] else ...[
                  // Brand Header Logo
                  Image.asset(
                    AppAssets.logo,
                    height: 38,
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) {
                      return Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.construction_rounded, color: AppColors.primaryYellow, size: 28),
                          const SizedBox(width: 8),
                          Text(
                            'Yeloline',
                            style: GoogleFonts.urbanist(
                              color: AppColors.primaryYellow,
                              fontWeight: FontWeight.w900,
                              fontSize: 20,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ],
                const Spacer(),
                // Notification Bell with Conditional Yellow Glowing Badge
                Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => _showNotificationModal(context),
                    borderRadius: BorderRadius.circular(24),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white12, width: 1),
                      ),
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          const Icon(
                            Icons.notifications_outlined,
                            color: Colors.white,
                            size: 22,
                          ),
                          if (_hasUnreadNotification)
                            Positioned(
                              top: -1,
                              right: -1,
                              child: Container(
                                width: 10,
                                height: 10,
                                decoration: BoxDecoration(
                                  color: AppColors.primaryYellow,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppColors.darkCharcoal, width: 1.5),
                                  boxShadow: const [
                                    BoxShadow(
                                      color: AppColors.primaryYellow,
                                      blurRadius: 5,
                                      spreadRadius: 1,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

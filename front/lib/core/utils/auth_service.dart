import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String _keyIsAdminLoggedIn = 'is_admin_logged_in';
  static const String _keyIsUserSkipped = 'is_user_skipped';

  static Future<bool> isAdminLoggedIn() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getBool(_keyIsAdminLoggedIn) ?? false;
    } catch (e) {
      return false;
    }
  }

  static Future<void> setAdminLoggedIn(bool value) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_keyIsAdminLoggedIn, value);
      if (value) {
        await prefs.setBool(_keyIsUserSkipped, false);
      }
    } catch (_) {}
  }

  static Future<bool> isUserSkipped() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getBool(_keyIsUserSkipped) ?? false;
    } catch (e) {
      return false;
    }
  }

  static Future<void> setUserSkipped(bool value) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_keyIsUserSkipped, value);
    } catch (_) {}
  }

  static Future<void> logoutAdmin() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_keyIsAdminLoggedIn, false);
    } catch (_) {}
  }

  static Future<void> clearAllSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
    } catch (_) {}
  }
}

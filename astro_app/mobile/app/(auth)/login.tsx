import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Backend expects x-www-form-urlencoded for OAuth2
            const formData = new URLSearchParams();
            formData.append('username', email); // OAuth2 expects 'username'
            formData.append('password', password);

            const response = await api.post('/auth/login', formData.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const { access_token } = response.data;
            await SecureStore.setItemAsync('token', access_token);

            router.replace('/(tabs)');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || 'Login failed. Please check your credentials.';
            Alert.alert('Login Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center px-6">
            <View className="items-center mb-10">
                <Text className="text-3xl font-bold text-violet-600">Astro360</Text>
                <Text className="text-gray-500 mt-2">Welcome back to your cosmic journey</Text>
            </View>

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-700 mb-1 ml-1">Email</Text>
                    <TextInput
                        className="w-full bg-gray-100 p-4 rounded-xl border border-gray-200"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View>
                    <Text className="text-gray-700 mb-1 ml-1">Password</Text>
                    <TextInput
                        className="w-full bg-gray-100 p-4 rounded-xl border border-gray-200"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className={`w-full bg-violet-600 p-4 rounded-xl items-center mt-4 ${loading ? 'opacity-70' : 'active:bg-violet-700'}`}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">{loading ? 'Logging in...' : 'Log In'}</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-500">Don't have an account? </Text>
                    <Link href="/(auth)/signup" asChild>
                        <TouchableOpacity>
                            <Text className="text-violet-600 font-bold">Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}

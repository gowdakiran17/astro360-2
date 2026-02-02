import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', {
                email,
                password,
                // name: name // Backend UserCreate model only has email/password currently
            });

            Alert.alert('Success', 'Account created! Please log in.', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') }
            ]);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || 'Signup failed.';
            Alert.alert('Signup Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center px-6">
            <View className="items-center mb-10">
                <Text className="text-3xl font-bold text-violet-600">Astro360</Text>
                <Text className="text-gray-500 mt-2">Create your account</Text>
            </View>

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-700 mb-1 ml-1">Full Name (Optional)</Text>
                    <TextInput
                        className="w-full bg-gray-100 p-4 rounded-xl border border-gray-200"
                        placeholder="Enter your full name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

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
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className={`w-full bg-violet-600 p-4 rounded-xl items-center mt-4 ${loading ? 'opacity-70' : 'active:bg-violet-700'}`}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">{loading ? 'Creating Account...' : 'Sign Up'}</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-500">Already have an account? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-violet-600 font-bold">Log In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}

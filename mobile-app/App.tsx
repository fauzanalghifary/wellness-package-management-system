import { PackageResponse } from '@wellness/shared';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState, type JSX } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { fetchMobilePackages } from './src/lib/api/packages';
import { formatPrice } from './src/lib/format';

type LoadState =
  | { status: 'loading' }
  | { status: 'loaded'; packages: PackageResponse[] }
  | { status: 'error'; message: string };

export default function App(): JSX.Element {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });

  const loadPackages = useCallback(async () => {
    setLoadState({ status: 'loading' });

    try {
      const response = await fetchMobilePackages();
      setLoadState({ status: 'loaded', packages: response.items });
    } catch (error: unknown) {
      setLoadState({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Unable to load packages'
      });
    }
  }, []);

  useEffect(() => {
    void loadPackages();
  }, [loadPackages]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.kicker}>Wellness</Text>
          <Text style={styles.title}>Available packages</Text>
          <Text style={styles.subtitle}>
            Browse treatments and sessions from the catalog.
          </Text>
        </View>

        {loadState.status === 'loading' ? (
          <View style={styles.centerState}>
            <ActivityIndicator color="#4f675b" />
            <Text style={styles.stateText}>Loading packages...</Text>
          </View>
        ) : null}

        {loadState.status === 'error' ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{loadState.message}</Text>
            <Pressable style={styles.retryButton} onPress={loadPackages}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {loadState.status === 'loaded' && loadState.packages.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.stateText}>No packages are available yet.</Text>
          </View>
        ) : null}

        {loadState.status === 'loaded' && loadState.packages.length > 0 ? (
          <FlatList
            contentContainerStyle={styles.list}
            data={loadState.packages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PackageCard wellnessPackage={item} />}
          />
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function PackageCard({
  wellnessPackage
}: {
  wellnessPackage: PackageResponse;
}): JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{wellnessPackage.name}</Text>
        <Text style={styles.price}>
          {formatPrice(wellnessPackage.priceCents)}
        </Text>
      </View>
      <Text style={styles.description}>{wellnessPackage.description}</Text>
      <Text style={styles.duration}>{wellnessPackage.durationMinutes} min</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#faf8f3'
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 16
  },
  kicker: {
    color: '#b76144',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  title: {
    color: '#18211f',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 8
  },
  subtitle: {
    color: '#4f675b',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8
  },
  list: {
    gap: 12,
    padding: 18,
    paddingBottom: 32
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(24, 33, 31, 0.12)',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between'
  },
  cardTitle: {
    color: '#18211f',
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0
  },
  price: {
    color: '#18211f',
    fontSize: 16,
    fontWeight: '700'
  },
  description: {
    color: '#4f675b',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10
  },
  duration: {
    alignSelf: 'flex-start',
    backgroundColor: '#d7eadf',
    borderRadius: 6,
    color: '#18211f',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  centerState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  stateText: {
    color: '#4f675b',
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center'
  },
  errorText: {
    color: '#b76144',
    fontSize: 15,
    marginBottom: 14,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#18211f',
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  retryText: {
    color: '#faf8f3',
    fontSize: 14,
    fontWeight: '700'
  }
});

// `main` in package.json points at this file, so we must register the root
// component ourselves (Expo's default AppEntry resolves App via a relative
// path that breaks under pnpm's symlinked node_modules).
registerRootComponent(App);

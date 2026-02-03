#!/usr/bin/env python3
"""
Test VedAstro Python library for KP support
"""

try:
    from vedastro import Calculate, Time, GeoLocation, PlanetName
    
    # Create test birth time
    time_str = "10:30 15/08/1990 +05:30"
    geo = GeoLocation("Chennai", 80.2707, 13.0827)
    time = Time(time_str, geo)
    
    print("VedAstro Library KP Capabilities Test")
    print("=" * 60)
    
    # Test 1: Check available Calculate methods
    print("\n1. Available Calculate methods:")
    kp_methods = [m for m in dir(Calculate) if 'cusp' in m.lower() or 'sublord' in m.lower() or 'starlord' in m.lower()]
    if kp_methods:
        for method in kp_methods:
            print(f"   ✓ {method}")
    else:
        print("   ✗ No KP-specific methods found")
    
    # Test 2: Try common KP method names
    print("\n2. Testing potential KP methods:")
    test_methods = [
        'HouseCusp',
        'SubLord',
        'StarLord',
        'KPHouseCusp',
        'PlanetSubLord',
        'PlanetStarLord',
        'CuspSubLord'
    ]
    
    for method_name in test_methods:
        if hasattr(Calculate, method_name):
            print(f"   ✓ Calculate.{method_name} exists")
            try:
                # Try calling it
                if 'Cusp' in method_name:
                    result = getattr(Calculate, method_name)(1, time)  # House 1
                else:
                    result = getattr(Calculate, method_name)(PlanetName.Sun, time)
                print(f"      Result: {result}")
            except Exception as e:
                print(f"      Error calling: {e}")
        else:
            print(f"   ✗ Calculate.{method_name} not found")
    
    # Test 3: List ALL Calculate methods
    print("\n3. All Calculate methods (first 50):")
    all_methods = [m for m in dir(Calculate) if not m.startswith('_')]
    for i, method in enumerate(all_methods[:50]):
        print(f"   - {method}")
        
    print(f"\n   Total methods: {len(all_methods)}")
    
except ImportError as e:
    print(f"Error importing vedastro: {e}")
    print("\nVedAstro library not installed or not available")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

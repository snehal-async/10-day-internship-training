"""
numpy_practice.py - Core NumPy concepts for Data Analysis and AI/ML.

Demonstrates:
1. Creating NumPy arrays (1D, 2D, special matrices)
2. Array dimensions, shape, data types, and reshaping
3. Indexing, slicing, and boolean masking
4. Vectorized arithmetic and broadcasting
5. Statistical aggregations across axes
"""
import numpy as np


def section(title: str):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def demonstrate_creation():
    section("1. ARRAY CREATION")
    
    # 1D and 2D arrays from Python lists
    arr_1d = np.array([10, 20, 30, 40, 50])
    arr_2d = np.array([[1, 2, 3], [4, 5, 6]])
    print("1D Array:\n", arr_1d)
    print("2D Array:\n", arr_2d)

    # Built-in generator functions
    zeros = np.zeros((2, 3), dtype=int)
    ones = np.ones((2, 2), dtype=float)
    range_arr = np.arange(0, 20, 4)  # start, stop, step
    linspace_arr = np.linspace(0, 1, 5)  # 5 evenly spaced values from 0 to 1

    print("\nZeros (2x3):\n", zeros)
    print("Ones (2x2):\n", ones)
    print("Arange (0 to 20 step 4):", range_arr)
    print("Linspace (0 to 1, 5 points):", linspace_arr)


def demonstrate_properties_and_reshaping():
    section("2. DIMENSIONS, SHAPE & RESHAPING")

    matrix = np.array([[10, 20, 30, 40], [50, 60, 70, 80], [90, 100, 110, 120]])
    print("Original Matrix:\n", matrix)
    print(f"  Shape       : {matrix.shape}  (3 rows, 4 columns)")
    print(f"  Dimensions  : {matrix.ndim}D")
    print(f"  Total Size  : {matrix.size} elements")
    print(f"  Data Type   : {matrix.dtype}")

    # Reshaping 3x4 into 2x6 and 4x3
    reshaped_2x6 = matrix.reshape((2, 6))
    flattened = matrix.flatten()
    print("\nReshaped to 2x6:\n", reshaped_2x6)
    print("Flattened 1D:\n", flattened)


def demonstrate_indexing_and_slicing():
    section("3. INDEXING, SLICING & BOOLEAN MASKING")

    arr = np.array([15, 25, 35, 45, 55, 65, 75])
    print("Array:", arr)
    print("  First element (index 0)   :", arr[0])
    print("  Last element (index -1)   :", arr[-1])
    print("  Slice [1:5]               :", arr[1:5])
    print("  Slice with step [::2]     :", arr[::2])

    matrix = np.array([
        [10, 20, 30],
        [40, 50, 60],
        [70, 80, 90]
    ])
    print("\n2D Matrix:\n", matrix)
    print("  Element at row 1, col 2   :", matrix[1, 2])
    print("  First two rows, cols 1-2  :\n", matrix[:2, 1:])

    # Boolean Masking (filtering without loops)
    scores = np.array([85, 42, 91, 67, 73, 98, 55])
    passed = scores[scores >= 70]
    print("\nScores:", scores)
    print("Boolean Condition (scores >= 70):", scores >= 70)
    print("Filtered passing scores        :", passed)


def demonstrate_math_and_broadcasting():
    section("4. MATHEMATICAL OPERATIONS & BROADCASTING")

    a = np.array([10, 20, 30])
    b = np.array([1, 2, 3])

    print("a:", a, "| b:", b)
    print("a + b :", a + b)
    print("a - b :", a - b)
    print("a * b :", a * b)
    print("a / b :", a / b)
    print("a ** 2:", a ** 2)

    # Broadcasting: Scalar applied to entire array
    print("\nBroadcasting scalar addition (a + 50):", a + 50)

    # 2D and 1D broadcasting
    grid = np.array([[10, 20, 30], [40, 50, 60]])
    bonus = np.array([1, 2, 3])
    print("\nGrid (2x3):\n", grid)
    print("Bonus (1x3):", bonus)
    print("Grid + Bonus (broadcasted across rows):\n", grid + bonus)


def demonstrate_aggregations():
    section("5. STATISTICAL AGGREGATIONS")

    data = np.array([
        [85, 90, 78],
        [60, 65, 70],
        [95, 98, 92],
        [88, 72, 84]
    ])
    print("Score Dataset (4 inspections x 3 metrics):\n", data)

    print("\nOverall Summary:")
    print(f"  Sum                : {np.sum(data)}")
    print(f"  Mean (Average)     : {np.mean(data):.2f}")
    print(f"  Standard Deviation : {np.std(data):.2f}")
    print(f"  Minimum            : {np.min(data)}")
    print(f"  Maximum            : {np.max(data)}")
    print(f"  Index of Max Val   : {np.argmax(data)}")

    # Column-wise (axis=0) and Row-wise (axis=1)
    col_means = np.mean(data, axis=0)
    row_means = np.mean(data, axis=1)
    print("\nAxis-Specific Aggregations:")
    print(f"  Metric Averages (axis=0, column-wise) : {col_means}")
    print(f"  Facility Averages (axis=1, row-wise)   : {row_means}")


def main():
    print("============================================================")
    print("   NUMPY ESSENTIALS FOR DATA SCIENCE & AI/ML - Day 03")
    print("============================================================")
    demonstrate_creation()
    demonstrate_properties_and_reshaping()
    demonstrate_indexing_and_slicing()
    demonstrate_math_and_broadcasting()
    demonstrate_aggregations()
    print("\nNumPy practice completed successfully!")


if __name__ == "__main__":
    main()
from typing_extensions import Self


def check_coordinate(value: int, limit: int) -> int:
    if not 0 <= value <= limit:
        raise ValueError(f"Coordinate must be between 0 and {limit}")
    return value


class Point2d:
    WIDTH = 800
    HEIGHT = 600

    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    @property
    def x(self) -> int:
        return self._x

    @x.setter
    def x(self, value: int):
        self._x = check_coordinate(value, self.WIDTH)

    @property
    def y(self) -> int:
        return self._y

    @y.setter
    def y(self, value: int):
        self._y = check_coordinate(value, self.HEIGHT)

    def __eq__(self, other) -> bool:
        if not isinstance(other, Point2d):
            return False
        return self._x == other._x and self._y == other._y

    def __str__(self) -> str:
        return f"Point2d(x={self._x}, y={self._y})"

    __repr__ = __str__


class Vector2d:
    __slots__ = ('_x', '_y')

    def __init__(self, x: int, y: int):
        self._x = x
        self._y = y

    @classmethod
    def from_points(cls, start: Point2d, end: Point2d) -> Self:
        return cls(end.x - start.x, end.y - start.y)

    def __getitem__(self, index: int) -> int:
        if index == 0:
            return self._x
        elif index == 1:
            return self._y
        raise IndexError("Vector index out of range")

    def __setitem__(self, index: int, value: int):
        if index == 0:
            self._x = value
        elif index == 1:
            self._y = value
        else:
            raise IndexError("Vector index out of range")

    def __iter__(self):
        yield self._x
        yield self._y

    def __len__(self) -> int:
        return 2

    def __eq__(self, other: Self) -> bool:
        if not isinstance(other, Vector2d):
            return False
        return self._x == other._x and self._y == other._y

    def __abs__(self) -> float:
        return (self._x**2 + self._y**2)**0.5

    def __add__(self, other: Self) -> Self:
        return Vector2d(self._x + other._x, self._y + other._y)

    def __sub__(self, other: Self) -> Self:
        return Vector2d(self._x - other._x, self._y - other._y)

    def __mul__(self, scalar: int | float) -> Self:
        return Vector2d(int(self._x * scalar), int(self._y * scalar))

    def __truediv__(self, scalar: int | float) -> Self:
        return Vector2d(int(self._x / scalar), int(self._y / scalar))

    @classmethod
    def dot_product(cls, first: Self, second: Self) -> int:
        return first._x * second._x + first._y * second._y

    def dot(self, other: Self) -> int:
        return self.dot_product(self, other)

    @classmethod
    def cross_product(cls, first: Self, second: Self) -> int:
        return first._x * second._y - first._y * second._x

    def cross(self, other: Self) -> int:
        return self.cross_product(self, other)

    @classmethod
    def triple_product(cls, a: Self, b: Self, c: Self) -> int:
        return a._x * (b._y * c._y) + a._y * (b._x * c._x)

    def mixed(self, second: Self, third: Self) -> int:
        return self.triple_product(self, second, third)

    def __str__(self) -> str:
        return f"Vector2d(x={self._x}, y={self._y})"

    __repr__ = __str__


# Тестирование
if __name__ == "__main__":
    # Проверка точек
    pt1 = Point2d(50, 100)
    pt2 = Point2d(150, 200)
    print(f"Points: {pt1}, {pt2}")
    print(f"Are equal: {pt1 == pt2}\n")

    # Проверка векторов
    vec1 = Vector2d(3, 4)
    vec2 = Vector2d.from_points(pt1, pt2)
    print(f"Vectors: {vec1}, {vec2}")
    print(f"Length of vec1: {abs(vec1)}")
    print(f"Sum: {vec1 + vec2}")
    print(f"Dot product: {vec1.dot(vec2)}")
    print(f"Cross product: {vec1.cross(vec2)}\n")

    # Проверка индексации
    print("Before:", vec1)
    vec1[0] += 10
    vec1[1] *= 2
    print("After:", vec1)
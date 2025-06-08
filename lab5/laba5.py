from dataclasses import dataclass, field
from typing import Protocol, Sequence, Optional, TypeVar, Generic, Dict, Any
import json
import os

T = TypeVar('T')

# 1. Класс User
@dataclass(order=True)
class User:
    sort_index: int = field(init=False, repr=False)
    id: int
    name: str
    login: str
    password: str = field(repr=False)
    email: Optional[str] = None
    address: Optional[str] = None
    
    def __post_init__(self):
        self.sort_index = self.id

# 2. Интерфейс репозитория
class DataRepositoryProtocol(Protocol[T]):
    def get_all(self) -> Sequence[T]: ...
    def get_by_id(self, id: int) -> Optional[T]: ...
    def add(self, item: T) -> None: ...
    def update(self, item: T) -> None: ...
    def delete(self, item: T) -> None: ...

class UserRepositoryProtocol(DataRepositoryProtocol[User], Protocol):
    def get_by_login(self, login: str) -> Optional[User]: ...

# 3. Реализация DataRepository
class DataRepository(Generic[T]):
    def __init__(self, filename: str, from_dict: Any):
        self.filename = filename
        self.from_dict = from_dict
        self._items: Dict[int, T] = {}
        self._load()

    def _load(self):
        if os.path.exists(self.filename):
            with open(self.filename, 'r') as f:
                data = json.load(f)
                for item_data in data:
                    item_data.pop('sort_index', None)
                    self._items[item_data['id']] = self.from_dict(item_data)

    def _save(self):
        with open(self.filename, 'w') as f:
            items_to_save = []
            for item in self._items.values():
                item_dict = vars(item).copy()
                item_dict.pop('sort_index', None)
                items_to_save.append(item_dict)
            json.dump(items_to_save, f)

    def get_all(self) -> Sequence[T]:
        return list(self._items.values())

    def get_by_id(self, id: int) -> Optional[T]:
        return self._items.get(id)

    def add(self, item: T) -> None:
        if hasattr(item, 'id'):
            self._items[item.id] = item
            self._save()

    def update(self, item: T) -> None:
        if hasattr(item, 'id') and item.id in self._items:
            self._items[item.id] = item
            self._save()

    def delete(self, item: T) -> None:
        if hasattr(item, 'id') and item.id in self._items:
            del self._items[item.id]
            self._save()

# 4. Реализация UserRepository
class UserRepository(DataRepository[User], UserRepositoryProtocol):
    def __init__(self, filename: str = 'users.json'):
        super().__init__(filename, lambda d: User(**d))

    def get_by_login(self, login: str) -> Optional[User]:
        for user in self.get_all():
            if user.login == login:
                return user
        return None

# 5. Интерфейс AuthService
class AuthServiceProtocol(Protocol):
    def sign_in(self, user: User) -> None: ...
    def sign_out(self) -> None: ...
    @property
    def is_authorized(self) -> bool: ...
    @property
    def current_user(self) -> Optional[User]: ...

# 6. Реализация AuthService
class AuthService(AuthServiceProtocol):
    def __init__(self, user_repo: UserRepositoryProtocol, auth_file: str = 'auth.json'):
        self.user_repo = user_repo
        self.auth_file = auth_file
        self._current_user: Optional[User] = None
        self._auto_sign_in()

    def _auto_sign_in(self):
        if os.path.exists(self.auth_file):
            with open(self.auth_file, 'r') as f:
                data = json.load(f)
                user = self.user_repo.get_by_id(data['user_id'])
                if user:
                    self._current_user = user

    def sign_in(self, user: User) -> None:
        self._current_user = user
        with open(self.auth_file, 'w') as f:
            json.dump({'user_id': user.id}, f)

    def sign_out(self) -> None:
        self._current_user = None
        if os.path.exists(self.auth_file):
            os.remove(self.auth_file)

    @property
    def is_authorized(self) -> bool:
        return self._current_user is not None

    @property
    def current_user(self) -> Optional[User]:
        return self._current_user

# 7. Демонстрация работы системы
def demo():
    # Инициализация репозитория и сервиса авторизации
    user_repo = UserRepository()
    auth_service = AuthService(user_repo)

    # Добавление пользователей
    user1 = User(id=1, name="Yura", login="yura", password="1234", email="yura@gmail.com")
    user2 = User(id=2, name="Andrey", login="andrey", password="12341234", address="Kaliningrad")
    
    user_repo.add(user1)
    user_repo.add(user2)
    
    print("All users:")
    for user in sorted(user_repo.get_all()):
        print(f"ID: {user.id}, Name: {user.name}, Login: {user.login}")

    # Авторизация
    print("\nSigning in as Yura...")
    auth_service.sign_in(user1)
    print(f"Is authorized: {auth_service.is_authorized}")
    print(f"Current user: {auth_service.current_user.name if auth_service.current_user else 'None'}")

    # Смена пользователя
    print("\nSigning in as Andrey...")
    auth_service.sign_in(user2)
    print(f"Current user: {auth_service.current_user.name if auth_service.current_user else 'None'}")

    # Выход
    print("\nSigning out...")
    auth_service.sign_out()
    print(f"Is authorized: {auth_service.is_authorized}")

    # Автоматическая авторизация при следующем запуске
    print("\nCreating new auth service to simulate restart...")
    new_auth_service = AuthService(user_repo)
    print(f"Auto-signed in as: {new_auth_service.current_user.name if new_auth_service.current_user else 'None'}")

if __name__ == "__main__":
    demo()
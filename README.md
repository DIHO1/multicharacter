# multicharacter

## Dodawanie projektu na GitHub
1. Wejdź do katalogu zasobu w terminalu (np. `cd /ścieżka/do/multicharacter`).
2. Zainicjuj repozytorium Git (jeśli jeszcze tego nie zrobiłeś):
   ```bash
   git init
   ```
3. Dodaj zdalne repozytorium GitHub (podmień `twoj-uzytkownik` i `twoje-repo`):
   ```bash
   git remote add origin https://github.com/twoj-uzytkownik/twoje-repo.git
   ```
4. Sprawdź status plików i dodaj je do commita:
   ```bash
   git status
   git add .
   ```
5. Utwórz commit z opisem zmian:
   ```bash
   git commit -m "Pierwsza wersja multicharacter"
   ```
6. Wyślij commit na GitHub (gałąź `main` lub inna, jeśli używasz innej nazwy):
   ```bash
   git push -u origin main
   ```
7. Przy kolejnych aktualizacjach powtarzaj kroki 4–6 (zaktualizuj wiadomość commita zgodnie ze zmianami).

> Jeśli repozytorium na GitHubie jest już zainicjowane z plikami (np. README), zanim wykonasz `git push`, pobierz je lokalnie poleceniem `git pull --rebase origin main`, aby uniknąć konfliktów.

## Udostępnianie projektu w rozmowie (na chacie)
1. Wykonaj kroki z sekcji powyżej, aby projekt znalazł się na GitHubie.
2. Otwórz stronę repozytorium w przeglądarce i skopiuj adres URL z paska adresu (np. `https://github.com/twoj-uzytkownik/twoje-repo`).
3. Wklej skopiowany link w wiadomości na chacie – rozmówca będzie mógł przejść bezpośrednio do repozytorium.
4. Jeśli repozytorium jest prywatne, dodaj rozmówcę jako współpracownika w ustawieniach GitHub (`Settings` → `Collaborators`), aby miał dostęp.
5. Alternatywnie możesz przygotować archiwum `.zip` projektu (GitHub udostępnia przycisk **Code → Download ZIP**) i przesłać je poprzez funkcję udostępniania plików dostępnych w danym komunikatorze.

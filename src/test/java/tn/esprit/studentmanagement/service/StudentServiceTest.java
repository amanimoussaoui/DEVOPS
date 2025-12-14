package tn.esprit.studentmanagement.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import tn.esprit.studentmanagement.entities.Student;
import tn.esprit.studentmanagement.repositories.StudentRepository;
import tn.esprit.studentmanagement.services.StudentService;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    void getAllStudents_shouldReturnListFromRepository() {
        // GIVEN : le repository renvoie une liste de 2 étudiants
        Student s1 = new Student();
        Student s2 = new Student();

        when(studentRepository.findAll()).thenReturn(List.of(s1, s2));

        // WHEN : on appelle le service
        List<Student> result = studentService.getAllStudents();

        // THEN : la taille est bien 2 et le repo a été appelé une seule fois
        assertEquals(2, result.size());
        verify(studentRepository).findAll();
    }
}
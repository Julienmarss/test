package com.legipilot.service.core.administrator.authentication;

import com.legipilot.service.core.administrator.AcceptInvitationUseCase;
import com.legipilot.service.core.administrator.SignUpCompanyRightsService;
import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.ValidationRepository;
import com.legipilot.service.core.administrator.domain.command.SignUp;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.core.company.domain.CompanyRepository;
import com.legipilot.service.core.company.domain.model.Company;
import com.legipilot.service.shared.domain.EmailPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SignUpWithInvitationUseCase {

    private final AdministratorRepository repository;
    private final ValidationRepository validationRepository;
    private final CompanyRepository companyRepository;
    private final InvitationRepository invitationRepository;
    private final SignUpCompanyRightsService signUpCompanyRightsService;
    private final AcceptInvitationUseCase acceptInvitationUseCase;
    private final EmailPort emailPort;

    @Transactional
    public Administrator execute(SignUp command, Optional<UUID> invitationToken) {
        Administrator administrator = Administrator.signup(command);
        Administrator savedAdmin = repository.save(administrator);

        if (invitationToken.isPresent()) {
            Optional<Invitation> invitation = invitationRepository.findByToken(invitationToken.get());
            if (invitation.isPresent() && invitation.get().isPending() &&
                    invitation.get().email().equalsIgnoreCase(command.email())) {
                acceptInvitationUseCase.execute(invitationToken.get(), command.email());
                UUID validationToken = validationRepository.createToken(savedAdmin);
                emailPort.sendVerificationEmail(savedAdmin, validationToken);
                return repository.get(savedAdmin.id());
            }
        }

        Company company = Company.register(savedAdmin, command);
        Company savedCompany = companyRepository.save(company);
        signUpCompanyRightsService.assignOwnerRights(savedAdmin, savedCompany);
        UUID validationToken = validationRepository.createToken(savedAdmin);
        emailPort.sendVerificationEmail(savedAdmin, validationToken);
        return repository.get(savedAdmin.id());
    }
}
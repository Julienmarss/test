package com.legipilot.service.shared.infra.security;

import com.legipilot.service.core.administrator.AdministratorService;
import com.legipilot.service.core.administrator.CompanyRightsService;
import com.legipilot.service.core.administrator.domain.model.Administrator;
import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import com.legipilot.service.shared.domain.error.NotAllowed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.UUID;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyRightsGuard {

    private final CompanyRightsService companyRightsService;
    private final AdministratorService administratorService;

    @Before("@annotation(requiresCompanyRight)")
    public void checkCompanyRights(JoinPoint joinPoint, RequiresCompanyRight requiresCompanyRight) {
        UUID currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new NotAllowed("Utilisateur non authentifié");
        }

        UUID companyId = extractCompanyId(joinPoint, requiresCompanyRight.companyIdParam());
        if (companyId == null) {
            throw new NotAllowed("ID de l'entreprise non trouvé dans les paramètres de la requête");
        }

        CompanyRight requiredRight = requiresCompanyRight.value();

        if (!companyRightsService.hasRight(currentUserId, companyId, requiredRight)) {
            log.warn("Accès refusé pour l'utilisateur {} sur l'entreprise {}. Requis: {}",
                    currentUserId, companyId, requiredRight.getDisplayName());
            throw new NotAllowed("Droits insuffisants. Requis: " + requiredRight.getDisplayName());
        }

        log.debug("Accès accordé pour l'utilisateur {} sur l'entreprise {} avec le droit {}",
                currentUserId, companyId, requiredRight.getDisplayName());
    }

    private UUID extractCompanyId(JoinPoint joinPoint, String companyIdParam) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Parameter[] parameters = method.getParameters();
        Object[] args = joinPoint.getArgs();

        for (int i = 0; i < parameters.length; i++) {
            Parameter param = parameters[i];

            // Si un nom de paramètre spécifique est donné
            if (!companyIdParam.isEmpty()) {
                if (isParameterNamed(param, companyIdParam)) {
                    return parseUUID(args[i]);
                }
            } else {
                // Recherche automatique par nom ou annotation
                if (isCompanyIdParameter(param)) {
                    return parseUUID(args[i]);
                }
            }
        }

        return null;
    }

    private boolean isParameterNamed(Parameter param, String expectedName) {
        // Vérifier les annotations @PathVariable et @RequestParam
        PathVariable pathVariable = param.getAnnotation(PathVariable.class);
        if (pathVariable != null) {
            String name = pathVariable.value().isEmpty() ? pathVariable.name() : pathVariable.value();
            return expectedName.equals(name);
        }

        RequestParam requestParam = param.getAnnotation(RequestParam.class);
        if (requestParam != null) {
            String name = requestParam.value().isEmpty() ? requestParam.name() : requestParam.value();
            return expectedName.equals(name);
        }

        return expectedName.equals(param.getName());
    }

    private boolean isCompanyIdParameter(Parameter param) {
        String paramName = param.getName().toLowerCase();

        // Recherche par nom du paramètre
        if (paramName.contains("company") && paramName.contains("id")) {
            return true;
        }

        // Recherche par annotation PathVariable/RequestParam
        PathVariable pathVariable = param.getAnnotation(PathVariable.class);
        if (pathVariable != null) {
            String name = pathVariable.value().isEmpty() ? pathVariable.name() : pathVariable.value();
            return name.toLowerCase().contains("company");
        }

        RequestParam requestParam = param.getAnnotation(RequestParam.class);
        if (requestParam != null) {
            String name = requestParam.value().isEmpty() ? requestParam.name() : requestParam.value();
            return name.toLowerCase().contains("company");
        }

        return false;
    }

    private UUID parseUUID(Object value) {
        if (value == null) return null;

        try {
            if (value instanceof UUID) {
                return (UUID) value;
            } else if (value instanceof String) {
                return UUID.fromString((String) value);
            }
        } catch (IllegalArgumentException e) {
            log.warn("Impossible de parser l'UUID depuis la valeur: {}", value);
        }

        return null;
    }

    private UUID getCurrentUserId() {
        try {
            String email = SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getName();

            if (email != null && !"anonymousUser".equals(email)) {
                Administrator admin = administratorService.get(email);
                return admin.id();
            }
        } catch (Exception e) {
            log.warn("Impossible de récupérer l'ID utilisateur depuis l'email: {}", e.getMessage());
        }

        return null;
    }
}